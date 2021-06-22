import './boilerplate.polyfill';

import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PDFModuleOptions } from '@t00nday/nestjs-pdf/dist';
import { PDFModule } from '@t00nday/nestjs-pdf/dist/pdf.module';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { OneSignalModule } from 'onesignal-api-client-nest/lib/onesignal.module';
import * as path from 'path';

import { contextMiddleware } from './middlewares';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ProductModule } from 'modules/product/product.module';
import { FileModule } from 'modules/file/file.module';
import { CartModule } from 'modules/cart/cart.module';
import { OrderModule } from 'modules/order/order.module';
@Module({
    imports: [
        FileModule,
        AuthModule,
        UserModule,
        AuditModule,
        MessageModule,
        SettingsModule,
        ProductModule,
        CartModule,
        HttpModule,
        OrderModule,
        MulterModule.register({
            dest: './uploads',
        }),

        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        I18nModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: configService.fallbackLanguage,
                parserOptions: {
                    path: path.join(__dirname, '/i18n/'),
                    watch: configService.isDevelopment,
                },
            }),
            imports: [SharedModule],
            parser: I18nJsonParser,
            inject: [ConfigService],
        }),
        MulterModule.register({
            dest: './**',
          }),
        OneSignalModule.forRootAsync({
            useFactory: (configService: ConfigService) =>
                configService.oneSignalConfig,
            inject: [ConfigService],
        }),
        PDFModule.registerAsync({
            isGlobal: true,
            useFactory: (): PDFModuleOptions => ({
                view: {
                    root: './static/templates/',
                    engine: 'twig',
                    extension: 'html',
                },
            }),
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
