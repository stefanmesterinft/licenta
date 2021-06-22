import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import * as _ from 'lodash';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: BadRequestException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let statusCode = exception.getStatus();
        const r = <any>exception.getResponse();

        if (_.isArray(r.message) && r.message[0] instanceof ValidationError) {
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
            const validationErrors = <ValidationError[]>r.message;
            this._validationFilter(validationErrors);
        } else if (_.isArray(r.message) && r.message[0]) {
            statusCode = HttpStatus.BAD_REQUEST;
            const validationErrors = <string[]>r.message;
            r.message = this._validationFilterString(validationErrors);
        }

        r.statusCode = statusCode;
        r.error = STATUS_CODES[statusCode];

        response.status(statusCode).json(r);
    }

    private _validationFilterString(validationErrors: string[]): any[] {
        const errors = [];
        for (const validationError of validationErrors) {
            if (validationError) {
                errors.push('error.rules.' + _.snakeCase(validationError));
            }
        }

        return errors;
    }

    private _validationFilter(validationErrors: ValidationError[]): void {
        for (const validationError of validationErrors) {
            for (const [constraintKey, constraint] of Object.entries(
                validationError.constraints,
            )) {
                if (!constraint) {
                    // convert error message to error.rules.{key} syntax for i18n translation
                    validationError.constraints[constraintKey] =
                        'error.rules.' + _.snakeCase(constraintKey);
                }
            }
            if (!_.isEmpty(validationError.children)) {
                this._validationFilter(validationError.children);
            }
        }
    }
}
