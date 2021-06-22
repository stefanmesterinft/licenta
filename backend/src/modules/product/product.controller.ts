'use strict';

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { RolesGuard } from 'guards/roles.guard';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { ProductDto } from './dto/Product.dto';
import { ProductCreateDto } from './dto/ProductCreate.dto';
import { ProductsPageDto } from './dto/ProductsPage.dto';
import { ProductsPageOptionsDto } from './dto/ProductsPageOptions.dto';
import { ProductService } from './product.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { ProductUpdateDto } from './dto/ProductUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadStorageFilter } from 'filters/upload-storage.filter';
import { UploadImageFilter } from 'filters/upload-image.filter';
import { FileService } from 'modules/file/file.service';
import { ProductsTypeaheadPageDto } from './dto/ProductsTypeaheadPage.dto';
import { ProductEntity } from './product.entity';

@Controller('products')
@ApiTags('products')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class ProductController {
    constructor(private _productService: ProductService,private _fileService: FileService) { }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of products',
        type: ProductsPageDto,
    })
    getProducts(
        @Query() pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        return this._productService.getProducts(pageOptionsDto);
    }

    @Get('men')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of products',
        type: ProductsPageDto,
    })
    getProductsMen(
        @Query() pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        return this._productService.getProductsMen(pageOptionsDto);
    }    
    
    @Get('women')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of products',
        type: ProductsPageDto,
    })
    getProductsWomen(
        @Query() pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        return this._productService.getProductsWomen(pageOptionsDto);
    }    
    
    @Get('men-new')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of products',
        type: ProductsPageDto,
    })
    getProductsMenNew(
        @Query() pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        return this._productService.getProductsMenNew(pageOptionsDto);
    }    
    
    @Get('women-new')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of products',
        type: ProductsPageDto,
    })
    getProductsWomenNew(
        @Query() pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        return this._productService.getProductsWomenNew(pageOptionsDto);
    }    
    
    @Get('brands')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of products',
        type: ProductsPageDto,
    })
    getProductsBrands(
        @Query() pageOptionsDto: ProductsPageOptionsDto,
    ): Promise<ProductsPageDto> {
        return this._productService.getProductsBrands(pageOptionsDto);
    }


    @Post('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: Boolean,
        description: 'Successfully Created',
    })
    async createProduct(
        @Body() productDto: ProductCreateDto,
        @AuthUser() authUser: UserEntity,
    ): Promise<ProductDto> {
        if(authUser){
            productDto.user = authUser
        }
        
        if(productDto.image){
            productDto.image = await this._fileService.findById(productDto.image);
        }        

        const product = await this._productService.createProduct(
            productDto,
        );  
        if (!product) {
            throw new NotFoundException();
        }



        return product.toDto();
    }

        @Get('/typeahead')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get products typeahead list',
        type: ProductsPageDto,
    })
    getProductsTypeahead(
        @Query()
        pageOptionsDto: ProductsPageOptionsDto,
        @AuthUser() authUser: UserEntity,
    ): Promise<ProductsTypeaheadPageDto> {        
        return this._productService.getProductsTypeahead(pageOptionsDto, authUser);
    }

    @Get('product/:code')
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ProductDto, description: 'Requested product' })
    @ApiParam({ name: 'code', description: 'Product identifier', type: 'string' })
    async getProductByCode(
        @Param('code') code: string,
        @AuthUser() authUser: UserEntity
    ): Promise<ProductDto[]> {
        const product = [...await this._productService.getProductByCode(code, authUser)]

        if (!product) {
            throw new NotFoundException();
        }

        return product.toDtos();
    }

    @Get('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ProductDto, description: 'Requested product' })
    @ApiParam({ name: 'id', description: 'Product identifier', type: 'string' })
    async getProduct(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
    ): Promise<ProductDto> {
        const product = await this._productService.findById(id, authUser);

        if (!product) {
            throw new NotFoundException();
        }

        return product.toDto();
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: ProductDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Product identifier', type: 'string' })
    async updateProduct(
        @Param('id') id: string,
        @Body() productDto: ProductUpdateDto,
        @AuthUser() authUser: UserEntity): Promise<ProductDto> {        
            const updatedProduct = await this._productService.updateProduct(id, productDto, authUser);
            return updatedProduct.toDto();
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Product identifier', type: 'string' })
    async deleteProduct(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._productService.deleteProduct(id, authUser);
    }
}
