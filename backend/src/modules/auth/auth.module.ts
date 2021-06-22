import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { smsService } from 'shared/services/sms.service';
import { SettingsModule } from 'modules/settings/settings.module';



@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => SettingsModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
       
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy,smsService],
    exports: [PassportModule.register({ defaultStrategy: 'jwt' }), AuthService],
})
export class AuthModule {}
