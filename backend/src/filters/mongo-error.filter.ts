import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { MongoError } from 'mongodb';

import { constraintErrors } from './constraint-errors';

@Catch(MongoError)
export class MongoErrorExceptionFilter implements ExceptionFilter {
    constructor(public reflector: Reflector) {}

    catch(exception: MongoError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const r: any = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: ['error.internal_error'],
        };

        if (exception.code === 11000) {
            r.statusCode = HttpStatus.BAD_REQUEST;
            const errors = this._parseErrors(exception.writeErrors);
            if (errors.length) {
                r.message = errors;
            }
        }

        r.error = STATUS_CODES[r.statusCode];
        response.status(r.statusCode).json(r);
    }

    private _parseErrors(errors): any[] {
        const err = [];

        for (const error of errors) {
            let field: string = error.errmsg.split('index:')[1];
            field = field.trim().split(' ')[0];
            field = field.trim();
            err.push(
                constraintErrors[field]
                    ? constraintErrors[field]
                    : `error.index.${field}`,
            );
        }

        return err;
    }
}
