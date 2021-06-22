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
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { RolesGuard } from 'guards/roles.guard';

import { RoleType } from '../../common/constants/role-type';
import { Roles } from '../../decorators/roles.decorator';
import { OrderDto } from './dto/Order.dto';
import { OrderCreateDto } from './dto/OrderCreate.dto';
import { OrdersPageDto } from './dto/OrdersPage.dto';
import { OrdersPageOptionsDto } from './dto/OrdersPageOptions.dto';
import { OrderService } from './order.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { OrderUpdateDto } from './dto/OrderUpdate.dto';
import { UserEntity } from 'modules/user/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { StatusType } from 'common/constants/status-type';
import { ProductService } from 'modules/product/product.service';

@Controller('orders')
@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class OrderController {
    constructor(private _orderService: OrderService,private _productsService: ProductService) { }

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of orders',
        type: OrdersPageDto,
    })
    getOrders(
        @Query() pageOptionsDto: OrdersPageOptionsDto,
    ): Promise<OrdersPageDto> {
        return this._orderService.getOrders(pageOptionsDto);
    }

    
    @Get('my')
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of orders',
        type: OrdersPageDto,
    })
    getMyOrders(
        @Query() pageOptionsDto: OrdersPageOptionsDto,
        @AuthUser() authUser: any,
    ): Promise<OrdersPageDto> {
        return this._orderService.getMyOrders(pageOptionsDto,authUser);
    }

    
    @Get('/count')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return list of orders',
        type: OrdersPageDto,
    })
    getCountOrders(
    ): Promise<any> {
        return this._orderService.getCountOrders();
    }


    @Post('')
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    @Recaptcha()
    @ApiOkResponse({
        type: Boolean,
        description: 'Successfully Created',
    })
    async createOrder(
        @Body() orderDto: any,
        @AuthUser() authUser: any,
    ): Promise<OrderDto> {

        console.log(authUser,orderDto);
        

        if (orderDto.products) {
            orderDto.products = [
                ...(await this._productsService.findProductsByIds(orderDto.products)),
            ];
            let index=0;
            orderDto.products.forEach(async element => {
                element.quantity = orderDto.quantity[index];
                index++;                
                if(element.stock >= element.quantity){
                    await this._productsService.updateProduct(element.id,{
                        stock: element.stock - element.quantity,
                    })
                }
            });
        } else {
            orderDto.products = [];
        }

        console.log(authUser);
        
        if (authUser) {
            orderDto.user = authUser;
        }

        orderDto.orderStatus = StatusType.PLACED;

        console.log(orderDto);
        

        const order = await this._orderService.createOrder(orderDto);

        return order.toDto();
    }

    @Get('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN,RoleType.USER)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: OrderDto, description: 'Requested order' })
    @ApiParam({ name: 'id', description: 'Order identifier', type: 'string' })
    async getOrder(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity
    ): Promise<OrderDto> {
        const order = await this._orderService.findById(id, authUser);

        if (!order) {
            throw new NotFoundException();
        }

        return order.toDto();
    }

    @Put('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: OrderDto, description: 'Successfully Updated' })
    @ApiParam({ name: 'id', description: 'Order identifier', type: 'string' })
    async updateOrder(
        @Param('id') id: string,
        @Body() orderDto: OrderUpdateDto,
        @AuthUser() authUser: UserEntity): Promise<OrderDto> {

        const updatedOrder = await this._orderService.updateOrder(id, orderDto, authUser);
        return updatedOrder.toDto();
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: Boolean, description: 'Successfully Deleted' })
    @ApiParam({ name: 'id', description: 'Order identifier', type: 'string' })
    async deleteOrder(
        @Param('id') id: string,
        @AuthUser() authUser: UserEntity): Promise<boolean> {
        return this._orderService.deleteOrder(id, authUser);
    }
}
