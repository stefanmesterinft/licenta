import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserEntity } from 'modules/user/user.entity';
import { Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsSesService } from '../../shared/services/aws-ses.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { MessageCreateDto } from './dto/MessageCreate.dto';
import { MessagesPageDto } from './dto/MessagesPage.dto';
import { MessagesPageOptionsDto } from './dto/MessagesPageOptions.dto';
import { MessageUpdateDto } from './dto/MessageUpdate.dto';
import { MessageEntity } from './message.entity';
import { MessageRepository } from './message.repository';
import { ConfigService } from '../../shared/services/config.service';

@Injectable()
export class MessageService extends BaseService {
    constructor(
        public readonly messageRepository: MessageRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsSesService: AwsSesService,
        public readonly configService: ConfigService
    ) {
        super();
    }

    protected _getRepository(): Repository<MessageEntity> {
        return this.messageRepository;
    }

    /**
     * Find single message
     */
    findOne(findData: Partial<MessageEntity>, _authUser?: UserEntity): Promise<MessageEntity> {
        return this.messageRepository.findOne(findData);
    }

    async findById(id: string, authUser?: UserEntity): Promise<MessageEntity> {
        const message = await this.findOne({ id: id }, authUser);

        return message;
    }

    /**
     * create message message
     */
    async createMessage(messageDto: MessageCreateDto): Promise<MessageEntity> {
        const message = this.messageRepository.create(messageDto);
        return this.messageRepository.save(message);
    }

    async getMessages(
        pageOptionsDto: MessagesPageOptionsDto,
    ): Promise<MessagesPageDto> {
        const queryBuilder = this.messageRepository.createQueryBuilder(
            'message',
        );

        const searchFields = [
            'message.name',
            'message.email',
            'message.message',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, 'message');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new MessagesPageDto(items.toDtos(), pageMetaDto);
    }


    async updateMessage(id: string, messageData: MessageUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<MessageEntity> {
        if (!skipFind) {
            const initialMessage = await this.findById(id, authUser);

            if (!initialMessage) {
                throw new NotFoundException();
            }
        }

        await this.messageRepository.save({ id: id, ...messageData });

        return this.findById(id);
    }

    async deleteMessage(id: string, authUser?: UserEntity): Promise<boolean> {
        const message = await this.findById(id, authUser);

        if (!message) {
            throw new NotFoundException();
        }

        await this.messageRepository.softRemove({ id: id, delete: true });

        return true;
    }

    async sendMessage(message): Promise<boolean> {
        if (!message.email || !message.message) {
            return false;
        }

        const mailOptions = {
            to: this.configService.get('EMAIL_ADMIN'),
            subject: 'Contact Message',
            text: `Contact message from ${message.name}`,
            html: `Hi! <br><br>You have received a new message from ${message.email}<br><br>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style = "border-collapse: collapse;">
                <tr>
                    <td width="150"><strong>Name:</strong></td>
                    <td>${message.name || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Telephone:</strong></td>
                    <td>${message.phone || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Location:</strong></td>
                    <td>${message.location || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>Message:</strong></td>
                </tr>
                <tr>
                    <td colspan="2"><br/>${message.message || '(Not provided)'}</td>
                </tr>
                </table>
            `,
        };

        const sent = await this.awsSesService.sendEmail(mailOptions);
        return !!sent;
    }
}
