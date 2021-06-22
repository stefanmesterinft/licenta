import { Injectable, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { ContextService } from '../../providers/context.service';
import { UtilsService } from '../../providers/utils.service';
import { ConfigService } from '../../shared/services/config.service';
import { UserDto } from '../user/dto/User.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayload.dto';
import { UserLoginDto } from './dto/UserLogin.dto';
import { getRepository } from 'typeorm';
import { PasswordForgot } from './passwordForgot.entity';
import { EmailVerification } from './emailVerification.entity';
import { AwsSesService } from '../../shared/services/aws-ses.service';
import { customRandom, nanoid, random } from 'nanoid';
import { RoleType } from '../../common/constants/role-type';
import { PhoneVerification } from './phoneVerification.entity';


import { smsService } from '../../shared/services/sms.service';
import * as moment from 'moment';



@Injectable()
export class AuthService {
    private static _authUserKey = 'user_key';
    private smscodeGenerator = customRandom('0123456789', 6, random);
    constructor(
        public readonly jwtService: JwtService,
        public readonly configService: ConfigService,
        public readonly userService: UserService,
        public readonly awsSesService: AwsSesService,
        public readonly smsService: smsService,
    ) {}

    async createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto> {
        return new TokenPayloadDto({
            expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
            accessToken: await this.jwtService.signAsync({ id: user.id }),
        });
    }

    async validateUser(
        userLoginDto: UserLoginDto,
        device?: string,
    ): Promise<UserEntity> {
        const user = await this.userService.findByEmailOrPhone(
            userLoginDto.email,
            userLoginDto.email,
        );

        const isPasswordValid = await UtilsService.validateHash(
            userLoginDto.password,
            user && user.password,
        );

        if (!user || !isPasswordValid) {
            throw new UserNotFoundException();
        }

        if (!user.accountConfirmed()) {
            throw new HttpException(
                'error.login.account_not_confirmed',
                HttpStatus.FORBIDDEN,
            );
        }

        if (user.suspendedAt != null && user.suspendedAt != undefined) {
            throw new HttpException(
                'error.login.account_suspended',
                HttpStatus.FORBIDDEN,
            );
        }

        return user;
    }

    async createEmailToken(email: string): Promise<boolean> {
        const emailVerificationRepository = getRepository(EmailVerification);
        let emailVerification = await emailVerificationRepository.findOne({
            where: { email: email },
            order: { createdAt: 'DESC' },
        });
        if (
            emailVerification &&
            (new Date().getTime() - emailVerification.createdAt.getTime()) /
                60000 <
                5
        ) {
            throw new BadRequestException(
                'error.email_verification.email_sent_recently',
            );
        } else {
            emailVerification = await emailVerificationRepository.save({
                email: email,
                token: nanoid(), //Generate 7 digits number
                timestamp: new Date(),
            });

            if (!emailVerification) {
                throw new HttpException(
                    'error.email_verification.no_valid_token_can_be_created',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            return true;
        }
    }

    async createForgottenPasswordToken(email: string): Promise<PasswordForgot> {
        const passwordForgotRepository = getRepository(PasswordForgot);
        var forgottenPassword = await passwordForgotRepository.findOne({
            where: { email: email },
            order: { createdAt: 'DESC' },
        });

        if (
            forgottenPassword &&
            (new Date().getTime() - forgottenPassword.createdAt.getTime()) /
                60000 <
                5
        ) {
            throw new BadRequestException(
                'error.forgot_password.email_sent_recently',
            );
        } else {
            const forgottenPassword = await passwordForgotRepository.save({
                email: email,
                token: nanoid(), //Generate 7 digits number
            });

            if (!forgottenPassword) {
                throw new HttpException(
                    'error.forgot_password.no_valid_token_can_be_created',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            return forgottenPassword;
        }
    }
    async verifyForgotenPassword(resetPassword: any): Promise<boolean> {
        let isNewPasswordChanged = false;
        if (resetPassword.email && resetPassword.currentPassword) {
            const isValidPassword = await this.checkPassword(
                resetPassword.email,
                resetPassword.currentPassword,
            );
            if (!isValidPassword) {
                throw new HttpException(
                    'error.reset_password.wrong_credentials',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            isNewPasswordChanged = await this.setPassword(
                resetPassword.email,
                resetPassword.password,
            );
        } else if (resetPassword.token) {
            const forgotPasswordRepository = getRepository(PasswordForgot);
            const forgottenPasswordModel = await this.getForgottenPasswordModel(
                resetPassword.token,
            );
            if (!forgottenPasswordModel) {
                throw new HttpException(
                    'error.reset_password.token_not_valid',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            isNewPasswordChanged = await this.setPassword(
                forgottenPasswordModel.email,
                resetPassword.password,
                true,
            );
            if (isNewPasswordChanged)
                await forgotPasswordRepository.remove(forgottenPasswordModel);
        } else {
            throw new HttpException(
                'error.reset_password.no_method_specified',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return isNewPasswordChanged;
    }

    async verifyEmail(token: string): Promise<boolean> {
        const emailVerificationRepository = getRepository(EmailVerification);
        const emailVerification = await emailVerificationRepository.findOne({
            token: token,
        });
        const timeSinceTokenCreation = moment().diff(
            emailVerification.createdAt,
        );
        if (
            emailVerification &&
            emailVerification.email &&
            timeSinceTokenCreation < 60 * 60000
        ) {
            const user = await this.userService.findOne({
                email: emailVerification.email,
            });
            if (user) {
                var savedUser = await this.userService.userRepository.update(
                    user.id,
                    {
                        emailConfirmed: true,
                    },
                );

                await emailVerificationRepository.remove(emailVerification);
                return !!savedUser;
            }
        } else {
            if (timeSinceTokenCreation > 60 * 60000) {
                await emailVerificationRepository.remove(emailVerification);
            }
            throw new BadRequestException(
                'error.email_verification.no_valid_token',
            );
        }
    }

    async getForgottenPasswordModel(
        newPasswordToken: string,
    ): Promise<PasswordForgot> {
        const passwordForgotRepository = getRepository(PasswordForgot);
        return await passwordForgotRepository.findOne({
            token: newPasswordToken,
        });
    }

    async sendEmailVerification(email: string): Promise<boolean> {
        const emailVerificationRepository = getRepository(EmailVerification);
        var model = await emailVerificationRepository.findOne({ email: email });

        if (model && model.token) {
            let mailOptions = {
                to: email,
                subject: 'Verify Email',
                text: 'Verify Email',
                html: `Hi! <br><br> Thank you for your registration<br><br>
                <a href="${this.configService.frontendUrl}/#/auth/email/verify/${model.token}">Click here to activate your account</a>`,
            };

            const sent = await this.awsSesService.sendEmail(mailOptions);
            return !!sent;
        } else {
            throw new NotFoundException();
        }
    }

    async checkPassword(email: string, password: string) {
        const user = await this.userService.userRepository.findOne({
            email: email,
        });
        if (!user) throw new NotFoundException();

        return await UtilsService.validateHash(password, user && user.password);
    }

    async sendEmailForgotPassword(email: string): Promise<boolean> {
        var user = await this.userService.userRepository.findOne({
            email: email,
        });
        if (!user) throw new NotFoundException();

        var token = await this.createForgottenPasswordToken(email);

        if (token && token.token) {
            let mailOptions = {
                to: email,
                subject: 'Frogotten Password',
                text: 'Forgot Password',
                html: `Hi! <br><br> Click on the link below if you requested to reset your password.<br>
                This link will expire after one use, if you need another link please request it again from forgot password area in portal. <br/><br/>
                <a href="${this.configService.frontendUrl}/#/auth/reset-password/${token.token}">Click here</a>`,
            };

            const sent = await this.awsSesService.sendEmail(mailOptions);
            return !!sent;
        } else {
            throw new NotFoundException();
        }
    }

    async sendEmailSetPassword(email: string): Promise<boolean> {
        var user = await this.userService.userRepository.findOne({
            email: email,
        });
        if (!user) throw new NotFoundException();

        var token = await this.createForgottenPasswordToken(email);

        if (token && token.token) {
            let mailOptions = {
                to: email,
                subject: 'Account created',
                text: 'Account created',
                html: `Hi ${user.firstName} ${user.lastName}! <br><br> We have created a new account for your. Please follow the link below to setup a your password before you can login<br>
                This link will expire after one use, if you need another link please request it again from forgot password area in portal. <br/><br/>
                <a href="${this.configService.frontendUrl}/#/auth/set-password/${token.token}">Click here</a>`,
            };

            const sent = await this.awsSesService.sendEmail(mailOptions);
            return !!sent;
        } else {
            throw new NotFoundException();
        }
    }

    async setPassword(
        email: string,
        newPassword: string,
        confirmEmail?: boolean,
    ): Promise<boolean> {
        var user = await this.userService.userRepository.findOne({
            email: email,
        });

        if (!user) {
            throw new NotFoundException();
        }

        const data: any = {
            password: newPassword,
        };

        if (confirmEmail) {
            data.emailConfirmed = true;
        }

        await this.userService.userRepository.update(user.id, data);

        return true;
    }

    static setAuthUser(user: UserEntity): void {
        ContextService.set(AuthService._authUserKey, user);
    }

    static getAuthUser(): UserEntity {
        const user = <UserEntity>ContextService.get(AuthService._authUserKey);
        return user ? user : null;
    }

    async createSMSToken(phone: string): Promise<boolean> {
        const phoneVerificationRepository = getRepository(PhoneVerification);
        let userVerification = await this.userService.userRepository.find({
            phone: phone,
        });
        let phoneVerification = await phoneVerificationRepository.findOne({
            where: { phone: phone },
            order: { createdAt: 'DESC' },
        });
        let timeLastToken = moment().diff(phoneVerification.createdAt);
        if (
            !userVerification ||
            (phoneVerification && timeLastToken / 60000 < 5)
        ) {
            throw new BadRequestException(
                'error.phone_verification.sms_sent_recently',
            );
        } else {
            phoneVerification = await phoneVerificationRepository.save({
                phone: phone,
                token: this.smscodeGenerator(), //Generate 6 digit number
                timestamp: new Date(),
            });

            if (!phoneVerification) {
                throw new HttpException(
                    'error.phone_verification.no_valid_token_can_be_created',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            return true;
        }
    }
    async verifySMSCode(token: string, phone: string): Promise<boolean> {
        const phoneVerificationRepository = getRepository(PhoneVerification);
        const phoneVerification = await phoneVerificationRepository.findOne({
            token: token,
            phone: phone,
        });
        const timeSinceTokenCreation = moment().diff(
            phoneVerification.createdAt,
        );

        if (
            phoneVerification &&
            phoneVerification.phone &&
            timeSinceTokenCreation < 60 * 60000
        ) {
            const user = await this.userService.findOne({
                phone: phoneVerification.phone,
            });
            if (user) {
                var savedUser = await this.userService.userRepository.update(
                    user.id,
                    {
                        phoneConfirmed: true,
                    },
                );

                await phoneVerificationRepository.remove(phoneVerification);
                return !!savedUser;
            } else {
                throw new BadRequestException(
                    'error.phone_verification.no_valid_token',
                );
            }
        } else {
            if (timeSinceTokenCreation > 60 * 60000) {
                await phoneVerificationRepository.remove(phoneVerification);
            }
            throw new BadRequestException(
                'error.phone_verification.no_valid_token',
            );
        }
    }

    async sendPhoneVerification(phone: string): Promise<any> {
        const phoneVerificationRepository = getRepository(PhoneVerification);
        var model = await phoneVerificationRepository.findOne({ phone: phone });

        if (model && model.token) {
            return this.smsService.sendAccountConfirmSMS(phone, model.token);
        } else {
            throw new NotFoundException();
        }
    }
}
