import {
    Body,
    Headers,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors, Query, NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { IFile } from '../../interfaces/IFile';
import { UserDto } from '../user/dto/User.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/LoginPayload.dto';
import { UserLoginDto } from './dto/UserLogin.dto';
import { UserRegisterDto } from './dto/UserRegister.dto';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { getRepository } from 'typeorm';
import { PasswordForgot } from './passwordForgot.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
        @Headers('device') device: string
    ): Promise<LoginPayloadDto> {
        const userEntity = await this.authService.validateUser(userLoginDto, device);
        const token = await this.authService.createToken(userEntity);
        return new LoginPayloadDto(userEntity.toDto(), token);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('avatar'))
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
        @UploadedFile() avatar: IFile
    ): Promise<UserDto> {
        const createdUser = await this.userService.registerUser(userRegisterDto, null);
        if (createdUser) {
            await this.authService.createEmailToken(createdUser.email);
            await this.authService.sendEmailVerification(createdUser.email);
        }

        return createdUser.toDto();
    }

    @Post('registerFromAccount')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('avatar'))
    async userRegisterFromAccount(
        @Body() userRegisterDto: UserRegisterDto,
        @UploadedFile() avatar: IFile,
        @AuthUser() authUser: UserEntity,
    ): Promise<UserDto> {
        const createdUser = await this.userService.registerUser(userRegisterDto, authUser);
        if (createdUser && !createdUser.accountConfirmed()) {
            await this.authService.createEmailToken(createdUser.email);
            await this.authService.sendEmailVerification(createdUser.email);
        }

        return createdUser.toDto();
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    async getCurrentUser(@AuthUser() authUser: UserEntity): Promise<UserDto> {
        const userDto = authUser.toDto();

        return userDto;
    }


    @Get('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: Boolean, description: 'Successfully logged out' })
    logout(@AuthUser() _authUser: UserEntity): any {
        return true;
    }


    @Get('email/verify/:token')
    public async verifyEmail(@Param() params): Promise<any> {
        await this.authService.verifyEmail(params.token);
        return { success: true };
    }

    @Get('email/resend-verification/:email')
    public async sendEmailVerification(@Param() params): Promise<any> {
        await this.authService.createEmailToken(params.email);
        await this.authService.sendEmailVerification(params.email);
        return { success: true };
    }

    @Get('forgot-password/:email')
    public async sendEmailForgotPassword(@Param() params): Promise<any> {
        await this.authService.sendEmailForgotPassword(params.email);
        return { success: true };
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    public async setNewPassord(@Body() resetPassword: ResetPasswordDto): Promise<any> {
        let isNewPasswordChanged: boolean = false;
        if (resetPassword.email && resetPassword.currentPassword) {
            const isValidPassword = await this.authService.checkPassword(resetPassword.email, resetPassword.currentPassword);
            if (!isValidPassword) {
                throw new HttpException('error.reset_password.wrong_credentials', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            isNewPasswordChanged = await this.authService.setPassword(resetPassword.email, resetPassword.password);
        } else if (resetPassword.token) {
            const forgotPasswordRepository = getRepository(PasswordForgot)
            const forgottenPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.token);
            if (!forgottenPasswordModel) {
                throw new HttpException('error.reset_password.token_not_valid', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            isNewPasswordChanged = await this.authService.setPassword(forgottenPasswordModel.email, resetPassword.password, true);
            if (isNewPasswordChanged) await forgotPasswordRepository.remove(forgottenPasswordModel);
        } else {
            throw new HttpException('error.reset_password.no_method_specified', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { isNewPasswordChanged: isNewPasswordChanged };
    }

    @Get('phone/verify/:phone/:smscode')
    public async verifySMSCode(@Param() params): Promise<any> {
        const isPhoneVerified = await this.authService.verifySMSCode(params.smscode,params.phone);
        return { isPhoneVerified: isPhoneVerified };
    }
   
    @Get('phone/send/:phone')
    public async sendPhoneVerification(@Param() params): Promise<any> {
        if(params.phone /*&& isPhoneNumber(params.phone,'US')*/){
            const canSend = await this.authService.createSMSToken(params.phone);
            if(canSend){
                
                await this.authService.sendPhoneVerification(params.phone);
                return { success: true };
                
            }else{
                throw new NotFoundException();
            }
        }
    }

    
}
