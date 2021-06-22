import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserEntity } from 'modules/user/user.entity';
import { Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsSesService } from '../../shared/services/aws-ses.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { OrderCreateDto } from './dto/OrderCreate.dto';
import { OrdersPageDto } from './dto/OrdersPage.dto';
import { OrdersPageOptionsDto } from './dto/OrdersPageOptions.dto';
import { OrderUpdateDto } from './dto/OrderUpdate.dto';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';
import { ConfigService } from '../../shared/services/config.service';

@Injectable()
export class OrderService extends BaseService {
    entityManager: any;
    constructor(
        public readonly orderRepository: OrderRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsSesService: AwsSesService,
        public readonly configService: ConfigService
    ) {
        super();
    }

    protected _getRepository(): Repository<OrderEntity> {
        return this.orderRepository;
    }

    /**
     * Find single order
     */
    findOne(findData: Partial<OrderEntity>, _authUser?: UserEntity): Promise<OrderEntity> {
        return this.orderRepository.findOne(findData);
    }

    async findById(id: string, authUser?: UserEntity): Promise<OrderEntity> {
        const queryBuilder = this.orderRepository.createQueryBuilder(
            'order',
        );

        const item = await queryBuilder
            .select()
            .where('order.id = :id', {id})
            .leftJoinAndMapOne(
                'order.user',
                'order.user',
                'user',
                'user.id = order.user_id',
            )
            .leftJoinAndMapMany('order.products', 'order.products', 'products')
            .getOne();

        return item;
    }

    async getCountOrders(): Promise<any> {
        const queryBuilder = this.orderRepository.createQueryBuilder(
            'order',
        );

        const queryBuilder2 = this.orderRepository.createQueryBuilder(
            'order',
        );

        const queryBuilder3 = this.orderRepository.createQueryBuilder(
            'order',
        );

        const queryBuilder4 = this.orderRepository.createQueryBuilder(
            'order',
        );

        const queryBuilder5 = this.orderRepository.createQueryBuilder(
            'order',
        );

        const queryBuilder6 = this.orderRepository.createQueryBuilder(
            'order',
        );

        const canceled = await queryBuilder
            .addSelect('COUNT(order.orderStatus)','canceled')
            .andWhere('order.orderStatus = :status',{status: "CANCELED"})
            .getCount();

        const sent = await queryBuilder2
            .addSelect('COUNT(order.orderStatus)','sent')
            .andWhere('order.orderStatus = :status',{status: "SENT"})
            .getCount();

        const delivered = await queryBuilder3
            .addSelect('COUNT(order.orderStatus)','delivered')
            .andWhere('order.orderStatus = :status',{status: "DELIVERED"})
            .getCount();

        const confirmed = await queryBuilder4
            .addSelect('COUNT(order.orderStatus)','confirmed')
            .andWhere('order.orderStatus = :status',{status: "CONFIRMED"})
            .getCount();

        const placed = await queryBuilder4
            .addSelect('COUNT(order.orderStatus)','placed')
            .andWhere('order.orderStatus = :status',{status: "PLACED"})
            .getCount();
        
        const total = await queryBuilder5
            .getCount();

        return {canceled,sent,delivered,confirmed,total,placed};
    }

    /**
     * create order order
     */
     async createOrder(orderDto: OrderCreateDto): Promise<OrderEntity> {
        const order = this.orderRepository.create(orderDto);
        
        return this.orderRepository.save(order);
    }

    async getOrders(
        pageOptionsDto: OrdersPageOptionsDto,
    ): Promise<OrdersPageDto> {
        const queryBuilder = this.orderRepository.createQueryBuilder(
            'order',
        );

        const searchFields = [
            'order.name',
            'order.email',
            'order.order',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, 'order');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapMany('order.products', 'order.products', 'products')
            .leftJoinAndMapOne(
                'order.user',
                'order.user',
                'user',
                'user.id = order.user_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new OrdersPageDto(items.toDtos(), pageMetaDto);
    }

    async getMyOrders(
        pageOptionsDto: OrdersPageOptionsDto,authUser:UserEntity
    ): Promise<OrdersPageDto> {
        const queryBuilder = this.orderRepository.createQueryBuilder(
            'order',
        );

        const searchFields = [
            'order.name',
            'order.email',
            'order.order',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, 'order');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .andWhere('order.user = :id',{id:authUser.id})
            .leftJoinAndMapMany('order.products', 'order.products', 'products')
            .leftJoinAndMapOne(
                'order.user',
                'order.user',
                'user',
                'user.id = order.user_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new OrdersPageDto(items.toDtos(), pageMetaDto);
    }


    async updateOrder(id: string, orderData: OrderUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<OrderEntity> {
        if (!skipFind) {
            const initialOrder = await this.findById(id, authUser);

            if (!initialOrder) {
                throw new NotFoundException();
            }
        }

        await this.orderRepository.save({ id: id, ...orderData });

        return this.findById(id);
    }

    async deleteOrder(id: string, authUser?: UserEntity): Promise<boolean> {
        const order = await this.findById(id, authUser);

        if (!order) {
            throw new NotFoundException();
        }

        await this.orderRepository.softRemove({ id: id, delete: true });

        return true;
    }

    async sendOrder(order): Promise<boolean> {
        if (!order.email || !order.order) {
            return false;
        }

        const mailOptions = {
            to: this.configService.get('EMAIL_ADMIN'),
            subject: 'Contact Order',
            text: `Contact order from ${order.name}`,
            html: `Hi! <br><br>You have received a new order from ${order.email}<br><br>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style = "border-collapse: collapse;">
                <tr>
                    <td width="150"><strong>Name:</strong></td>
                    <td>${order.name || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Telephone:</strong></td>
                    <td>${order.phone || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Location:</strong></td>
                    <td>${order.location || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>Order:</strong></td>
                </tr>
                <tr>
                    <td colspan="2"><br/>${order.order || '(Not provided)'}</td>
                </tr>
                </table>
            `,
        };

        const sent = await this.awsSesService.sendEmail(mailOptions);
        return !!sent;
    }
}
