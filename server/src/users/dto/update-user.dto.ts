import {PartialType} from '@nestjs/mapped-types';
import {CreateUserDto} from './create-user.dto';
import {IsEmail, IsNotEmpty, MinLength} from "class-validator";
import {IsEmailUnique} from "./is-email-unique.validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @IsEmailUnique({message: 'Email đã được sử dụng'})
    email: string;
}
