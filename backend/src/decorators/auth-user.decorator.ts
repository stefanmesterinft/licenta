import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../modules/user/user.entity';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: UserEntity = <UserEntity>request.user;        
        return user;
    },
);
