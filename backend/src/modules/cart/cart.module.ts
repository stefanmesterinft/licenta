import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { ConfigService } from '../../shared/services/config.service';
import { FileModule } from 'modules/file/file.module';
import { ProductModule } from 'modules/product/product.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([CartRepository]),
        GoogleRecaptchaModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.recaptchaConfig,
            inject: [ConfigService]
        }),
        FileModule,
        ProductModule
    ],
    controllers: [CartController],
    exports: [CartService],
    providers: [CartService],
})
export class CartModule { }
