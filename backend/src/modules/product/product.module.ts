import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ConfigService } from '../../shared/services/config.service';
import { FileModule } from 'modules/file/file.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([ProductRepository]),
        GoogleRecaptchaModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.recaptchaConfig,
            inject: [ConfigService]
        }),
        FileModule
    ],
    controllers: [ProductController],
    exports: [ProductService],
    providers: [ProductService],
})
export class ProductModule { }
