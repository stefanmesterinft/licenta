  
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { ConfigService } from '../../shared/services/config.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([FileRepository]),
        GoogleRecaptchaModule.forRootAsync({
            useFactory: (configService: ConfigService) =>
                configService.recaptchaConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [FileController],
    exports: [FileService],
    providers: [FileService],
})
export class FileModule {}