import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { AuditController } from './audit.controller';
import { AuditRepository } from './audit.repository';
import { AuditService } from './audit.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([AuditRepository]),
    ],
    controllers: [AuditController],
    exports: [AuditService],
    providers: [AuditService],
})
export class AuditModule {}
