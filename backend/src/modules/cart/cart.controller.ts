'use strict';

import {
    BadRequestException,
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
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'guards/roles.guard';

import { CartDto } from './dto/Cart.dto';
import { CartCreateDto } from './dto/CartCreate.dto';
import { CartsPageDto } from './dto/CartsPage.dto';
import { CartsPageOptionsDto } from './dto/CartsPageOptions.dto';
import { CartService } from './cart.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { CartUpdateDto } from './dto/CartUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { FileService } from 'modules/file/file.service';
import { ProductService } from 'modules/product/product.service';

@Controller('cart')
@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class CartController {
    constructor(private _cartService: CartService,private _fileService: FileService, private _productService: ProductService) { }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of carts',
        type: CartsPageDto,
    })
    getCarts(
        @Query() pageOptionsDto: CartsPageOptionsDto,
    ): Promise<CartsPageDto> {
        return this._cartService.getCarts(pageOptionsDto);
    }


    @Post('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: Boolean,
        description: 'Successfully Created',
    })
    async createCart(
        @Body() cartDto: CartCreateDto,
        @AuthUser() authUser: UserEntity,
    ): Promise<CartDto> {
        if(authUser){
            cartDto.user = authUser
        } 
        
        if(cartDto.productId){
            cartDto.productId = await this._productService.findById(cartDto.productId);
        }
        console.log(cartDto.productId);
        
        const existingCartProduct = await this._cartService.findByProductIdAndUser(authUser,cartDto.productId);

        console.log(existingCartProduct);
        
        if(existingCartProduct){
            cartDto.quantity = cartDto.quantity + existingCartProduct.quantity;
            const updatedCart = await this._cartService.updateCart(existingCartProduct.id, cartDto, authUser);
            return updatedCart.toDto();
        }
        const cart = await this._cartService.createCart(
            cartDto,
        );  
        if (!cart) {
            throw new NotFoundException();
        }



        return cart.toDto();
    }

    @Get('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: CartDto, description: 'Requested cart' })
    @ApiParam({ name: 'id', description: 'Cart identifier', type: 'string' })
    async getCart(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
    ): Promise<CartDto> {
        const cart = await this._cartService.findById(id, authUser);

        if (!cart) {
            throw new NotFoundException();
        }

        return cart.toDto();
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: CartDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Cart identifier', type: 'string' })
    async updateCart(
        @Param('id') id: string,
        @Body() cartDto: any,
        @AuthUser() authUser: UserEntity): Promise<CartDto> {

        const productCheck = await this._productService.findById(cartDto.productId);
        if(productCheck.stock < cartDto.quantity){
            throw new BadRequestException('Stock unavailable! Only ' + productCheck.stock + ' items available for ' + cartDto.name)
        }
        

        
        const updatedCart = await this._cartService.updateCart(id, {quantity: cartDto.quantity}, authUser);        
        return updatedCart.toDto();
    }
    
    @Delete('/user')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'userId', description: 'Cart identifier', type: 'string' })
    async deleteUserCart(
        @AuthUser() authUser: UserEntity): Promise<any> {
            return this._cartService.deleteUserCart(authUser);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Cart identifier', type: 'string' })
    async deleteCart(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._cartService.deleteCart(id, authUser);
    }

}
