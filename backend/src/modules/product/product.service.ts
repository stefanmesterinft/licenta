import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { In, Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsSesService } from '../../shared/services/aws-ses.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { ProductCreateDto } from './dto/ProductCreate.dto';
import { ProductsPageDto } from './dto/ProductsPage.dto';
import { ProductsPageOptionsDto } from './dto/ProductsPageOptions.dto';
import { ProductUpdateDto } from './dto/ProductUpdate.dto';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';
import { ConfigService } from '../../shared/services/config.service';
import { ProductsTypeaheadPageDto } from './dto/ProductsTypeaheadPage.dto';

@Injectable()
export class ProductService extends BaseService {
    constructor(
        public readonly productRepository: ProductRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsSesService: AwsSesService,
        public readonly configService: ConfigService
    ) {
        super();
    }

    protected _getRepository(): Repository<ProductEntity> {
        return this.productRepository;
    }

    /**
     * Find single product
     */
    findOne(findData: Partial<ProductEntity>, _authUser?: UserEntity): Promise<ProductEntity> {
        return this.productRepository.findOne(findData);
    }

    async findById(id: any, authUser?: UserEntity): Promise<ProductEntity> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const item = await queryBuilder
            .select()
            .where('product.id = :id', {id})
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getOne();

        return item;
    }

    async getProductByCode(code: any, authUser?: UserEntity): Promise<ProductEntity[]> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const items = await queryBuilder
            .select()
            .where('product.code = :code', {code})
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getMany();

        return items;
    }

    /**
     * create product product
     */
    async createProduct(productDto: ProductCreateDto): Promise<ProductEntity> {
        const product = this.productRepository.create(productDto);
        
        return this.productRepository.save(product);
    }

    async getProducts(
        pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const searchFields = [
            'product.name',
            'product.brand',
            'product.description',
            'product.material',
            'product.color',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        //this.columnSort(queryBuilder, pageOptionsDto.sort, 'product');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy("product.code")
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new ProductsPageDto(items.toDtos(), pageMetaDto);
    }

    async getProductsMen(
        pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const searchFields = [
            'product.name',
            'product.brand',
            'product.description',
            'product.material',
            'product.color',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        //this.columnSort(queryBuilder, pageOptionsDto.sort, 'product');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy("product.code")
            .andWhere('product.sex = :sex',{sex: "M"})
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new ProductsPageDto(items.toDtos(), pageMetaDto);
    }

    async getProductsWomen(
        pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const searchFields = [
            'product.name',
            'product.brand',
            'product.description',
            'product.material',
            'product.color',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        //this.columnSort(queryBuilder, pageOptionsDto.sort, 'product');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy("product.code")
            .andWhere('product.sex = :sex',{sex: "F"})
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new ProductsPageDto(items.toDtos(), pageMetaDto);
    }

    async getProductsMenNew(
        pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const searchFields = [
            'product.name',
            'product.brand',
            'product.description',
            'product.material',
            'product.color',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        //this.columnSort(queryBuilder, pageOptionsDto.sort, 'product');

        var date = new Date();
        date.setDate(date.getDate() - 90);


        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy("product.code")
            .andWhere('product.sex = :sex',{sex: "M"})
            .andWhere('product.created_at > :start_at', { start_at: date })
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new ProductsPageDto(items.toDtos(), pageMetaDto);
    }

    async getProductsWomenNew(
        pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const searchFields = [
            'product.name',
            'product.brand',
            'product.description',
            'product.material',
            'product.color',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        //this.columnSort(queryBuilder, pageOptionsDto.sort, 'product');

        
        var date = new Date();
        date.setDate(date.getDate() - 90);

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy("product.code")
            .andWhere('product.sex = :sex',{sex: "F"})
            .andWhere('product.created_at > :start_at', { start_at: date })
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new ProductsPageDto(items.toDtos(), pageMetaDto);
    }

    async getProductsBrands(
        pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        const queryBuilder = this.productRepository.createQueryBuilder(
            'product',
        );

        const searchFields = [
            'product.name',
            'product.brand',
            'product.description',
            'product.material',
            'product.color',
        ];

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        //this.columnSort(queryBuilder, pageOptionsDto.sort, 'product');

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy("product.code")
            .andWhere("product.brand = :brand",{brand: 'Nike'})
            .leftJoinAndMapOne(
                'product.user',
                'product.user',
                'user',
                'user.id = product.user_id',
            )
            .leftJoinAndMapOne(
                'product.image',
                'product.image',
                'image',
                'image.id = product.image_id',
            )
            .getManyAndCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems,
        });
        return new ProductsPageDto(items.toDtos(), pageMetaDto);
    }

    async getProductsTypeahead(
        pageOptionsDto: ProductsPageOptionsDto,
        authUser: UserEntity,
    ): Promise<ProductsTypeaheadPageDto> {
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        
        this.textSearch(queryBuilder, pageOptionsDto.q, [
            'product.name',
            'product.brand',
        ]);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, 'product');

        const query = queryBuilder
            .select([
                'product.id as id',
                "CONCAT(product.name, ' ', product.brand as name",
            ])
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const items = await query.getRawMany();
        const total = await query.getCount();

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: total,
        });
        return new ProductsTypeaheadPageDto(items, pageMetaDto);
    }


    async updateProduct(id: string, productData: ProductUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<ProductEntity> {
        if (!skipFind) {
            const initialProduct = await this.findById(id, authUser);

            if (!initialProduct) {
                throw new NotFoundException();
            }
        }

        await this.productRepository.save({ id: id, ...productData });

        return this.findById(id);
    }

    async deleteProduct(id: string, authUser?: UserEntity): Promise<boolean> {
        const product = await this.findById(id, authUser);

        if (!product) {
            throw new NotFoundException();
        }

        await this.productRepository.softRemove({ id: id, delete: true });

        return true;
    }

    async sendProduct(product): Promise<boolean> {
        if (!product.email || !product.product) {
            return false;
        }

        const mailOptions = {
            to: this.configService.get('EMAIL_ADMIN'),
            subject: 'Contact Product',
            text: `Contact product from ${product.name}`,
            html: `Hi! <br><br>You have received a new product from ${product.email}<br><br>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style = "border-collapse: collapse;">
                <tr>
                    <td width="150"><strong>Name:</strong></td>
                    <td>${product.name || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Telephone:</strong></td>
                    <td>${product.phone || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td width="150"><strong>Location:</strong></td>
                    <td>${product.location || '(Not provided)'}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>Product:</strong></td>
                </tr>
                <tr>
                    <td colspan="2"><br/>${product.product || '(Not provided)'}</td>
                </tr>
                </table>
            `,
        };

        const sent = await this.awsSesService.sendEmail(mailOptions);
        return !!sent;
    }

    async findProductsByIds(ids: any[]): Promise<any[]> {
        console.log(ids);
        const products = await this.productRepository.find({
            where: { id: In(ids) },
        });
        return products;
    }
}
