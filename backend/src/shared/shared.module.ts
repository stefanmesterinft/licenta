import { Global, HttpModule, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AwsS3Service } from './services/aws-s3.service';
import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';
import { AuditModule } from '../modules/audit/audit.module';
import { AuditSubscriber } from 'shared/subscribers/audit.subscriber';
import { UserSubscriber } from './subscribers/user.subscriber';
import { AwsSesService } from './services/aws-ses.service';
import { TwilioModule } from 'nestjs-twilio';
import { SettingsModule } from 'modules/settings/settings.module';

const providers = [
    ConfigService,
    ValidatorService,
    AwsS3Service,
    AwsSesService,
    GeneratorService,
    AuditSubscriber,
    UserSubscriber
];

@Global()
@Module({
    providers,
    imports: [
        forwardRef(() => AuditModule),
        forwardRef(() => SettingsModule),
        HttpModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_KEY'),
                // if you want to use token with expiration date
                // signOptions: {
                //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
                // },
            }),
            inject: [ConfigService],
        }),
        // TwilioModule.forRootAsync({
        //     imports: [SharedModule],
        //     useFactory: async (cfg: ConfigService) => ({
        //       accountSid: cfg.twilioConfig.accountSid,
        //       authToken: cfg.twilioConfig.authToken
        //     }),
        //     inject: [ConfigService],
        // }),
    ],
    exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}
