import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { DeviceController } from './device.controller';
import { DeviceRepository } from './device.repository';
import { DeviceService } from './device.service';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { CsvModule } from 'nest-csv-parser';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => CustomerModule),
        forwardRef(() => UserModule),
        CsvModule,
        TypeOrmModule.forFeature([DeviceRepository]),
    ],
    controllers: [DeviceController],
    exports: [DeviceService],
    providers: [DeviceService],
})
export class DeviceModule {}
