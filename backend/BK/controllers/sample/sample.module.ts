import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { SampleController } from './sample.controller';
import { SampleRepository } from './sample.repository';
import { SampleService } from './sample.service';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { CsvModule } from 'nest-csv-parser';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => CustomerModule),
        forwardRef(() => UserModule),
        CsvModule,
        TypeOrmModule.forFeature([SampleRepository]),
    ],
    controllers: [SampleController],
    exports: [SampleService],
    providers: [SampleService],
})
export class SampleModule {}
