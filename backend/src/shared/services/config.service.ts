import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import * as dotenv from 'dotenv';
import { OneSignalConfig } from '../../interfaces/OneSignalConfig';
import { twilioConfig } from '../../interfaces/TwilioConfig';
import { IAwsS3Config } from '../../interfaces/IAwsS3Config';
import { IAwsSesConfig } from '../../interfaces/IAwsSesConfig';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

export class ConfigService {
    constructor(){
        const nodeEnv = this.nodeEnv;
        dotenv.config({
            path: `.${nodeEnv}.env`,
        });

        // Replace \\n with \n to support multiline strings in AWS
        for (const envName of Object.keys(process.env)) {
            process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
        }
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    public get(key: string): string {
        return process.env[key];
    }

    public getNumber(key: string): number {
        return Number(this.get(key));
    }

    public getBoolean(key: string): boolean {
        return JSON.parse(this.get(key));
    }

    get nodeEnv(): string {
        return this.get('NODE_ENV') || 'development';
    }

    get fallbackLanguage(): string {
        return this.get('FALLBACK_LANGUAGE').toLowerCase();
    }

    get baseurl(): string {
        return this.get('BASEURL')
    }

    get frontendUrl(): string {
        return this.get('FRONTENDURL')
    }

    get typeOrmConfig(): TypeOrmModuleOptions {
        let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
        let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

        if ((<any>module).hot) {
            const entityContext = (<any>require).context(
                './../../modules',
                true,
                /\.entity\.ts$/,
            );
            entities = entityContext.keys().map((id) => {
                const entityModule = entityContext(id);
                const [entity] = Object.values(entityModule);
                return entity;
            });
            const migrationContext = (<any>require).context(
                './../../migrations',
                false,
                /\.ts$/,
            );
            migrations = migrationContext.keys().map((id) => {
                const migrationModule = migrationContext(id);
                const [migration] = Object.values(migrationModule);
                return migration;
            });
        }

        return {
            entities,
            migrations,
            type: 'postgres',
            host: this.get('DB_HOST'),
            port: this.getNumber('DB_PORT'),
            username: this.get('DB_USERNAME'),
            password: this.get('DB_PASSWORD'),
            database: this.get('DB_DATABASE'),
            migrationsRun: true,
            logging: !!this.getBoolean('DB_LOG'),
            namingStrategy: new SnakeNamingStrategy(),
        };
    }

    get awsS3Config(): IAwsS3Config {
        return {
            accessKeyId: this.get('AWS_S3_ACCESS_KEY_ID'),
            secretAccessKey: this.get('AWS_S3_SECRET_ACCESS_KEY'),
            bucketName: this.get('S3_BUCKET_NAME'),
        };
    }

    get awsSesConfig(): IAwsSesConfig {
        return {
            accessKeyId: this.get('AWS_SES_ACCESS_KEY_ID'),
            secretAccessKey: this.get('AWS_SES_SECRET_ACCESS_KEY')
        };
    }

    get oneSignalConfig(): OneSignalConfig {
        return {
            appId: this.get('ONESIGNAL_APP_ID'),
            restApiKey: this.get('ONESIGNAL_REST_API_KEY'),
        };
    }

    get recaptchaConfig(): GoogleRecaptchaModuleOptions  {
        return {
            secretKey: this.get('GOOGLE_RECAPTCHA_SECRET_KEY'),
            response: (req) => req.headers.recaptcha,
            skipIf: this.getBoolean('GOOGLE_RECAPTCHA_SKIP')
        };
    }
    get twilioConfig(): twilioConfig{
        return {
            accountSid: this.get('TWILIO_ACCOUNT_SID'),
            authToken: this.get('TWILIO_AUTH_TOKEN')
        }
    }
   
}