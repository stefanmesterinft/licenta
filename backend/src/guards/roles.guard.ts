import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserEntity } from '../modules/user/user.entity';
import { RoleType } from '../common/constants/role-type';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly _reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this._reflector.get<string[]>(
            'roles',
            context.getHandler(),
        );

        const roles_all_except = this._reflector.get<string[]>(
            'roles_all_except',
            context.getHandler(),
        );
        
        if (!(roles || roles_all_except)) {
            return true;
        }
       
        if(roles_all_except && !roles){
            const request = context.switchToHttp().getRequest();
            const user = <UserEntity>request.user;
            return user.roles.some((r) => Object.values(RoleType).includes(r) && !roles_all_except.includes(r));
        }

        const request = context.switchToHttp().getRequest();
        const user = <UserEntity>request.user;
        return user.roles.some((r) => roles.includes(r));
    }
}
