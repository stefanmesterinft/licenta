import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { TestController } from './test.controller';
import { TestRepository } from './test.repository';
import { TestService } from './test.service';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { JobModule } from '../job/job.module';
import { DeviceModule } from '../device/device.module';
import { SampleModule } from '../sample/sample.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => CustomerModule),
        forwardRef(() => UserModule),
        forwardRef(() => JobModule),
        forwardRef(() => DeviceModule),
        forwardRef(() => SampleModule),
        TypeOrmModule.forFeature([TestRepository]),
    ],
    controllers: [TestController],
    exports: [TestService],
    providers: [TestService],
})
export class TestModule {}
