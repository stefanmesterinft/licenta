import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { JobController } from './job.controller';
import { JobRepository } from './job.repository';
import { JobService } from './job.service';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => CustomerModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([JobRepository]),
    ],
    controllers: [JobController],
    exports: [JobService],
    providers: [JobService],
})
export class JobModule {}
