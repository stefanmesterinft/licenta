import { HttpService, Injectable } from "@nestjs/common";
import { reject } from "lodash";
import { SettingsService } from "modules/settings/settings.service";
import { InjectTwilio, TwilioClient } from "nestjs-twilio";

import { ConfigService } from "./config.service";

@Injectable()
export class smsService {
    client = null;
    
    constructor(
        //@InjectTwilio() private readonly client: TwilioClient,
    ) { 
        
    }
    public async sendAccountConfirmSMS(phoneNumber: string, token: string): Promise<any> {
        const phone = String('+1' + parseInt(phoneNumber.replace(/\D/g,''),10))

        return new Promise(async (resolve,reject) => {
            try{
                const response = await this.sendTwilioSMS(phone, `${token} is your account activation code for the Shop Platform`);
                resolve(true);
            }catch(e){
                resolve(false);
            }
        });
    }

    private async sendTwilioSMS(phoneNumber: string, message: string):Promise<any> {
        try {
            return this.client.messages.create({
                body: message,
                from: "+14158911519",
                to: phoneNumber,
            });
        } catch (e) {
            return e
        }
    }
}
