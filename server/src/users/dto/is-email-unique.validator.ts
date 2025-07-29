import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import {Injectable} from '@nestjs/common';
import {UsersService} from '../users.service'; // service để check email

@ValidatorConstraint({async: true})
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersService: UsersService) {
    }

    async validate(email: string, _args: ValidationArguments): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        return !user;
    }

    defaultMessage(args: ValidationArguments): string {
        return `Email '${args.value}' đã tồn tại`;
    }
}

// Hàm decorator để dùng trong DTO
export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUniqueConstraint,
        });
    };
}
