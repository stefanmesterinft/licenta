import { Column, Entity, JoinTable, ManyToMany, OneToMany, ManyToOne, Index } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { UserDto } from './dto/User.dto';
import { Transform } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    
    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ 
        type:"enum", 
        enum: RoleType, 
        array: true, 
        default: [RoleType.USER] 
    })
    roles: RoleType[] = [RoleType.USER];

    @Column({ nullable: false })
    @Index({ unique: true, where: "deleted_at is NULL" })
    @Transform((value:string) => value.toLowerCase())
    email: string;

    @Column({ nullable: true, default: false })
    emailConfirmed: boolean;

    @Column({ nullable: true })
    password: string;


    @Column({ nullable: true })
    @Index({ unique: true, where: "deleted_at is NULL" })
    phone: string;

    @Column({ nullable: true, default: false })
    phoneConfirmed: boolean;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ nullable: true })
    cover?: string;

    // If simple user
    @Column({ nullable: true })
    middleName?: string;

    @Column({ type: 'timestamp without time zone', nullable: true })
    dateOfBirth?: Date;

    @Column({ nullable: true })
    @Index({ unique: true, where: "(social_security_number != '' and social_security_number IS NOT NULL and deleted_at is NULL)" })
    socialSecurityNumber?: string;

    @Column({ nullable: true })
    address1: string;

    @Column({ nullable: true })
    address2: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    postalCode: string;

    @Column({ nullable: true })
    about?: string;

    @Column({ nullable: true })
    sex: string;

    @Column({ nullable: true })
    race_ethnicity?: string;

    @Column({nullable: true})
    suspendedAt:Date;

    /** @this UserEntity */
    hasRole(...roles: RoleType[]) {
        return this.roles.some((r) => roles.includes(r));
    }


    accountConfirmed(){
        return this.emailConfirmed || this.phoneConfirmed
    }
    dtoClass = UserDto;
}