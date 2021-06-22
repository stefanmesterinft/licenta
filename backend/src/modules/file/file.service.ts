import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { UserEntity } from 'modules/user/user.entity';
import { In, Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsSesService } from '../../shared/services/aws-ses.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { FileCreateDto } from './dto/FileCreate.dto';
import { FilePageDto } from './dto/FilesPage.dto';
import { FilePageOptionsDto } from './dto/FilesPageOptions.dto';
import { FileUpdateDto } from './dto/FileUpdate.dto';
import { FileEntity } from './file.entity';
import { FileRepository } from './file.repository';
import { ConfigService } from '../../shared/services/config.service';

@Injectable()
export class FileService extends BaseService {
    constructor(
        public readonly fileRepository: FileRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsSesService: AwsSesService,
        public readonly configService: ConfigService,
    ) {
        super();
    }

    protected _getRepository(): Repository<FileEntity> {
        return this.fileRepository;
    }

    /**
     * Find single file
     */
    findOne(
        findData: Partial<FileEntity>,
        _authUser?: UserEntity,
    ): Promise<FileEntity> {
        return this.fileRepository.findOne(findData);
    }

    async findById(id: string, authUser?: UserEntity): Promise<FileEntity> {
        const file = await this.findOne({ id: id }, authUser);

        return file;
    }

    /**
     * create file
     */
    async createFile(fileDto: FileCreateDto): Promise<FileEntity> {
        const file = this.fileRepository.create(fileDto);
        return this.fileRepository.save(file);
    }

    async getFiles(pageOptionsDto: FilePageOptionsDto): Promise<FilePageDto> {
        const queryBuilder = this.fileRepository.createQueryBuilder('file');

        const searchFields = ['file.title', 'file.description', 'file.name'];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, 'title');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new FilePageDto(items.toDtos(), pageMetaDto);
    }

    async updateFile(
        id: string,
        fileData: FileUpdateDto,
        authUser?: UserEntity,
        skipFind?: Boolean,
    ): Promise<FileEntity> {
        if (!skipFind) {
            const initialFile = await this.findById(id, authUser);

            if (!initialFile) {
                throw new NotFoundException();
            }
        }

        await this.fileRepository.save({ id: id, ...fileData });

        return this.findById(id);
    }

    async deleteFile(id: string, authUser?: UserEntity): Promise<boolean> {
        const resoruce = await this.findById(id, authUser);

        if (!resoruce) {
            throw new NotFoundException();
        }

        await this.fileRepository.softRemove({ id: id, delete: true });

        return true;
    }

    async findFilesByIds(ids: any[]): Promise<any[]> {
        console.log(ids);
        const files = await this.fileRepository.find({
            where: { id: In(ids) },
        });
        return files;
    }
}