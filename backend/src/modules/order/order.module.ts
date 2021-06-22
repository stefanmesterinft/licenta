import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { ConfigService } from '../../shared/services/config.service';
import { ProductModule } from 'modules/product/product.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([OrderRepository]),
        GoogleRecaptchaModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.recaptchaConfig,
            inject: [ConfigService]
        }),
        ProductModule
    ],
    controllers: [OrderController],
    exports: [OrderService],
    providers: [OrderService],
})
export class OrderModule { }
