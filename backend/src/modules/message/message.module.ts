import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { ConfigService } from '../../shared/services/config.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([MessageRepository]),
        GoogleRecaptchaModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.recaptchaConfig,
            inject: [ConfigService]
        })
    ],
    controllers: [MessageController],
    exports: [MessageService],
    providers: [MessageService],
})
export class MessageModule { }
