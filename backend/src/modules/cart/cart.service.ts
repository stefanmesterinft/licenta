import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsSesService } from '../../shared/services/aws-ses.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CartCreateDto } from './dto/CartCreate.dto';
import { CartsPageDto } from './dto/CartsPage.dto';
import { CartsPageOptionsDto } from './dto/CartsPageOptions.dto';
import { CartUpdateDto } from './dto/CartUpdate.dto';
import { CartEntity } from './cart.entity';
import { CartRepository } from './cart.repository';
import { ConfigService } from '../../shared/services/config.service';
import { ProductEntity } from 'modules/product/product.entity';

@Injectable()
export class CartService extends BaseService {
    constructor(
        public readonly cartRepository: CartRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsSesService: AwsSesService,
        public readonly configService: ConfigService
    ) {
        super();
    }

    protected _getRepository(): Repository<CartEntity> {
        return this.cartRepository;
    }

    /**
     * Find single cart
     */
    findOne(findData: Partial<CartEntity>, _authUser?: UserEntity): Promise<CartEntity> {
        return this.cartRepository.findOne(findData);
    }

    async findById(id: string, authUser?: UserEntity): Promise<CartEntity> {
        const cart = await this.findOne({ id: id }, authUser);

        return cart;
    }

    async findByProductIdAndUser(authUser:UserEntity,product:any){
        const existingProduct = await this.findOne({productId:product.id}, authUser);
        return existingProduct;        
    }

    /**
     * create cart cart
     */
    async createCart(cartDto: CartCreateDto): Promise<CartEntity> {
        const cart = this.cartRepository.create(cartDto);
        
        return this.cartRepository.save(cart);
    }

    async getCarts(
        pageOptionsDto: CartsPageOptionsDto,
    ): Promise<CartsPageDto> {
        const queryBuilder = this.cartRepository.createQueryBuilder(
            'cart',
        );

        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        //this.columnSort(queryBuilder, pageOptionsDto.sort, 'cart');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne(
                'cart.user',
                'cart.user',
                'user',
                'user.id = cart.user_id',
            )
            .leftJoinAndMapOne(
                'cart.productId',
                'cart.productId',
                'product',
                'product.id = cart.productId',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new CartsPageDto(items.toDtos(), pageMetaDto);
    }


    async updateCart(id: string, cartData: CartUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<CartEntity> {
        if (!skipFind) {
            const initialCart = await this.findById(id, authUser);

            if (!initialCart) {
                throw new NotFoundException();
            }
        }

        await this.cartRepository.save({ id: id, ...cartData });

        return this.findById(id);
    }

    async deleteCart(id: string, authUser?: UserEntity): Promise<boolean> {
        const cart = await this.findById(id, authUser);

        if (!cart) {
            throw new NotFoundException();
        }

        await this.cartRepository.softRemove({ id: id, delete: true });

        return true;
    }

    async deleteUserCart(authUser: UserEntity): Promise<any> {
        const queryBuilder = this.cartRepository.createQueryBuilder(
            'cart',
        );
        return await queryBuilder
            .delete()
            .from('carts')
            .where("user_id = :id",{id: authUser.id})
            .execute();

    }

    async sendCart(cart): Promise<boolean> {
        if (!cart.email || !cart.cart) {
            return false;
        }

        const mailOptions = {
            to: this.configService.get('EMAIL_ADMIN'),
            subject: 'Contact Cart',
            text: `Contact cart from ${cart.name}`,
            html: `Hi! <br><br>You have received a new cart from ${cart.email}<br><br>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style = "border-collapse: collapse;">
                <tr>
                    <td width="150"><strong>Name:</strong></td>
                    <td>${cart.name || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Telephone:</strong></td>
                    <td>${cart.phone || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Location:</strong></td>
                    <td>${cart.location || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>Cart:</strong></td>
                </tr>
                <tr>
                    <td colspan="2"><br/>${cart.cart || '(Not provided)'}</td>
                </tr>
                </table>
            `,
        };

        const sent = await this.awsSesService.sendEmail(mailOptions);
        return !!sent;
    }
}
