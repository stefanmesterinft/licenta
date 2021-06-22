import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { AuditsPageDto } from './dto/AuditPage.dto';
import { AuditsPageOptionsDto } from './dto/AuditPageOptions.dto';
import { AuditEntity } from './audit.entity';
import { AuditRepository } from './audit.repository';
import { AuditUpdateDto } from './dto/AuditUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { AuditCreateDto } from './dto/AuditCreate.dto';
import { RoleType } from '../../common/constants/role-type';

@Injectable()
export class AuditService extends BaseService {
    constructor(
        public readonly auditRepository: AuditRepository,
        public readonly validatorService: ValidatorService
    ) {
        super();
    }

    protected _getRepository(): Repository<AuditEntity> {
        return this.auditRepository;
    }

    /**
     * Find single audit
     */
    findOne(findData: Partial<AuditEntity>, _authUser?: UserEntity): Promise<AuditEntity> {

        return this.auditRepository.findOne(findData, { 
            relations: ["user"]
        });
    }

    async findById(id: string, authUser?: UserEntity): Promise<AuditEntity> {
        const audit = await this.findOne({id: id}, authUser);

        return audit;
    }

    async createAudit(auditDto: AuditCreateDto): Promise<AuditEntity> {
        const audit = this.auditRepository.create(auditDto);
        return this.auditRepository.save(audit);
    }

    async getAudits(pageOptionsDto: AuditsPageOptionsDto, authUser: UserEntity): Promise<AuditsPageDto> {
        const queryBuilder = this.auditRepository.createQueryBuilder('audit');

        let searchFields = ['audit.identifier', 'audit.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email',  'renter.name', 'renter.email'];

        if(authUser && authUser.hasRole(RoleType.ADMIN)){
            searchFields = ['audit.identifier', 'audit.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "audit");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("audit.user", "audit.user", "user", "user.id = audit.user_id")
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new AuditsPageDto(items.toDtos(), pageMetaDto);
    }

    async updateAudit(id: string, auditData: AuditUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<AuditEntity> {
        if(!skipFind){
            const initialAudit = await this.findById(id, authUser);

            if (!initialAudit) {
                throw new NotFoundException();
            }
        }

        await this.auditRepository.save({id: id, ...auditData});

        return this.findById(id);
    }

    async deleteAudit(id: string, authUser?: UserEntity): Promise<boolean> {
        const audit = await this.findById(id, authUser);

        if (!audit) {
            throw new NotFoundException();
        }

        await this.auditRepository.softRemove({id: id, delete: true});

        return true;
    }
}
