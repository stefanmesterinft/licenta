import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
    ExpressAdapter,
    NestExpressApplication,
} from '@nestjs/platform-express';
import * as compression from 'compression';
import * as RateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { setupSwagger } from './swagger';
import { AuthUserInterceptor } from 'interceptors/auth-user-interceptor.service';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { join } from 'path';

async function bootstrap() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        { cors: true },
    );
    app.enableCors();
    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet());
    app.use(
        RateLimit({
            windowMs: 1 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    );
    app.use(compression());
    app.use(morgan('combined'));
    app.useStaticAssets(join(__dirname, '..', 'uploads'));
    app.useStaticAssets(join(__dirname, '..', 'static'));

    const reflector = app.get(Reflector);

    app.useGlobalFilters(
        new HttpExceptionFilter(reflector),
        new QueryFailedFilter(reflector),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(reflector),
        new AuthUserInterceptor()
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            validationError: {
                target: false,
            },
        }),
    );

    const configService = app.select(SharedModule).get(ConfigService);

    app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            port: configService.getNumber('TRANSPORT_PORT'),
            retryAttempts: 5,
            retryDelay: 3000,
        },
    });

    await app.startAllMicroservicesAsync();

    if (['development', 'staging', 'production'].includes(configService.nodeEnv)) {
        setupSwagger(app);
    }

    const port = configService.getNumber('PORT');
    const host = configService.get('HOST') || 'localhost';
    await app.listen(port, host);

    console.info(`server running on port ${host}:${port}`);
}

void bootstrap();
