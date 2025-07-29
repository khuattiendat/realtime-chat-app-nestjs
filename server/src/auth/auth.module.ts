import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {UsersService} from "../users/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [AuthService, JwtStrategy, UsersService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
