import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';
import { IsEmailUnique } from './is-email-unique.validator';
export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @IsEmailUnique({ message: 'Email đã được sử dụng' })
    email: string;

    @MinLength(6)
    @IsNotEmpty()
    password: string;
}
