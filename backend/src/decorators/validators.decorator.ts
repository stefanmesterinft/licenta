/* tslint:disable:naming-convention */

import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function IsPassword(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isPassword',
            target: object.constructor,
            constraints: [],
            options: {
                message: `${propertyName} is not a valid password`,
                ...validationOptions,
            },
            validator: {
                validate(value: string, _args: ValidationArguments) {
                    return /^[a-zA-Z0-9!@#$%^&*]*$/.test(value);
                },
            },
        });
    };
}


export function IsDateInThePast(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsDateInThePast",
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: `${propertyName} is not a date in the past`,
                ...validationOptions,
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return new Date(value).getTime() < new Date((new Date()).getTime() - 1000 * 60 * 60 * 24).getTime();
                }
            }
        });
    };
}
