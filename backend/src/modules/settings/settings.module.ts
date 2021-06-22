import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { SettingsController } from './settings.controller';
import { SettingsRepository } from './settings.repository';
import { SettingsService } from './settings.service';


@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([SettingsRepository]),
    ],
    controllers: [SettingsController],
    exports: [SettingsService],
    providers: [SettingsService],
})
export class SettingsModule {}
