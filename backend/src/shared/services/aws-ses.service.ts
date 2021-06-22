import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { isArray } from 'lodash';

import { ConfigService } from './config.service';
import { GeneratorService } from './generator.service';

@Injectable()
export class AwsSesService {
    private readonly _ses: AWS.SES;

    constructor(
        public configService: ConfigService,
        public generatorService: GeneratorService,
    ) {
        const options: AWS.SES.Types.ClientConfiguration = {
            apiVersion: '2020-10-01',
            region: 'us-east-1',
        };

        const awsSesConfig = configService.awsSesConfig;
        if (awsSesConfig.accessKeyId && awsSesConfig.secretAccessKey) {
            options.credentials = awsSesConfig;
        }

        this._ses = new AWS.SES(options);
    }

    async sendEmail(options: any): Promise<any> {
        const params = {
            Destination: {
                ToAddresses: isArray(options.to) ? options.to : [options.to],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: options.html,
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: options.text,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: options.subject,
                },
            },
            ReturnPath:
                options.reply ||
                options.from ||
                `"${this.configService.get(
                    'EMAIL_FROM_NAME',
                )}" <${this.configService.get('EMAIL_FROM')}>`,
            Source:
                options.from ||
                `"${this.configService.get(
                    'EMAIL_FROM_NAME',
                )}" <${this.configService.get('EMAIL_FROM')}>`,
        };

        console.log(JSON.stringify(params, null, 4));
        //const sent = await this._ses.sendEmail(params).promise();
        return true;
    }
}