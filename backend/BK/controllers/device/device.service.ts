import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Any, Repository } from 'typeorm';

import { PageMetaDto } from '../../common/dto/PageMeta.dto';
import { BaseService } from '../../common/services/base.service';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { DevicesPageDto } from './dto/DevicesPage.dto';
import { DevicesPageOptionsDto } from './dto/DevicesPageOptions.dto';
import { DeviceEntity } from './device.entity';
import { DeviceRepository } from './device.repository';
import { DeviceUpdateDto } from './dto/DeviceUpdate.dto';
import { UserEntity } from '../user/user.entity';
import { DeviceDto } from './dto/Device.dto';
import { DeviceCreateDto } from './dto/DeviceCreate.dto';
import { RoleType } from '../../common/constants/role-type';
import { createReadStream, existsSync } from 'fs';
import { CsvParser } from 'nest-csv-parser';
import { join } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class DeviceService extends BaseService {
    constructor(
        public readonly deviceRepository: DeviceRepository,
        public readonly validatorService: ValidatorService,
        public readonly awsS3Service: AwsS3Service,
        private readonly csvParser: CsvParser
    ) {
        super();
    }

    protected _getRepository(): Repository<DeviceEntity> {
        return this.deviceRepository;
    }

    /**
     * Find single device
     */
    findOne(findData: Partial<DeviceEntity>, authUser?: UserEntity, skipAssigned?: Boolean): Promise<DeviceEntity> {
        const customer: any= {};
        const renter: any = {};

        if(authUser && authUser.customer){
           customer.customer = authUser.customer;
           renter.renter = authUser.customer;
        }

        if(!skipAssigned && authUser && authUser.hasRole(RoleType.TESTER_MONITOR, RoleType.TESTER)){
            customer.assigned = Any([authUser.id, null]);
            renter.assigned = Any([authUser.id, null]);
        }

        return this.deviceRepository.findOne( { 
            where :  [
                {
                    ...customer,
                    ...findData
                },
                {
                    ...renter,
                    ...findData
                },
            ],
            relations: ["customer","renter","assigned"]
        });
    }

    async findById(id: string, authUser?: UserEntity): Promise<DeviceEntity> {
        const device = await this.findOne({id: id}, authUser);

        return device;
    }

    async createDevice(deviceDto: DeviceCreateDto): Promise<DeviceEntity> {
        const device = this.deviceRepository.create(deviceDto);
        return this.deviceRepository.save(device);
    }

    async getMyDevices(pageOptionsDto: DevicesPageOptionsDto, authUser: UserEntity): Promise<DevicesPageDto> {
        const queryBuilder = this.deviceRepository.createQueryBuilder('device');


        queryBuilder.andWhere('(device.customer_id = :customer_id OR device.renter_id = :customer_id)', {
            customer_id: authUser.customer.id,
        })
        .andWhere('(device.assigned_id = :assigned_id)', {
            assigned_id: authUser.id,
        });

        let searchFields = ['device.identifier', 'device.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email',  'renter.name', 'renter.email', 'customer.name', 'customer.email'];

        if(authUser && authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)){
            searchFields = ['device.identifier', 'device.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "device");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("device.customer", "device.customer", "customer", "customer.id = device.customer_id")
            .leftJoinAndMapOne("device.assigned", "device.assigned", "assigned", "assigned.id = device.assigned_id")
            .leftJoinAndMapOne("device.renter", "device.renter", "renter", "renter.id = device.renter_id")
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new DevicesPageDto(items.toDtos(), pageMetaDto);
    }

    async getDevices(pageOptionsDto: DevicesPageOptionsDto, authUser: UserEntity): Promise<DevicesPageDto> {
        const queryBuilder = this.deviceRepository.createQueryBuilder('device');

        if(authUser && authUser.customer){
            queryBuilder.andWhere('(device.customer_id = :customer_id OR device.renter_id = :customer_id)', {
                customer_id: authUser.customer.id,
            });
        }

        /*
        if(authUser && authUser.hasRole(RoleType.TESTER_MONITOR, RoleType.TESTER)){
            queryBuilder.andWhere('(device.assigned_id = :assigned_id OR device.assigned_id is NULL)', {
                assigned_id: authUser.id,
            });
        }
        */

        let searchFields = ['device.identifier', 'device.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email',  'renter.name', 'renter.email', 'customer.name', 'customer.email'];

        if(authUser && authUser.hasRole(RoleType.TESTER, RoleType.TESTER_MONITOR, RoleType.TESTER_ADMIN)){
            searchFields = ['device.identifier', 'device.barcode', 'assigned.firstName', 'assigned.lastName', 'assigned.email'];
        }

        this.textSearch(queryBuilder, pageOptionsDto.q, searchFields);
        this.columnFilter(queryBuilder, pageOptionsDto.filter);
        this.columnSort(queryBuilder, pageOptionsDto.sort, "device");

        const [items, totalItems] = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .leftJoinAndMapOne("device.customer", "device.customer", "customer", "customer.id = device.customer_id")
            .leftJoinAndMapOne("device.assigned", "device.assigned", "assigned", "assigned.id = device.assigned_id")
            .leftJoinAndMapOne("device.renter", "device.renter", "renter", "renter.id = device.renter_id")
            .getManyAndCount();
    
        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            totalItems: totalItems,
        });
        return new DevicesPageDto(items.toDtos(), pageMetaDto);
    }

    async updateDevice(id: string, deviceData: DeviceUpdateDto, authUser?: UserEntity, skipFind?: Boolean): Promise<DeviceEntity> {
        if(!skipFind){
            const initialDevice = await this.findById(id, authUser);

            if (!initialDevice) {
                throw new NotFoundException();
            }
        }

        await this.deviceRepository.save({id: id, ...deviceData});

        return this.findById(id);
    }

    async deleteDevice(id: string, authUser?: UserEntity): Promise<boolean> {
        const device = await this.findById(id, authUser);

        if (!device) {
            throw new NotFoundException();
        }

        await this.deviceRepository.softRemove({id: id, delete: true});

        return true;
    }

    async importer(file: any): Promise<boolean> {
        const imported = await this.defaultImporter(this.csvParser, DeviceEntity, file);
     
        return imported;
    }
}
