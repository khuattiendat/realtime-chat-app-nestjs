import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        const comparedPassword = user && await bcrypt.compare(pass, user.password);
        if (user && comparedPassword) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const {messages, rooms, password, ...other} = user;
        const payload = {...other};
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<any> {
        const user = await this.usersService.findOneById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Old password is incorrect');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        return this.usersService.update(id, user);
    }

    async getProfile(id: number): Promise<any> {
        const user = await this.usersService.findOneById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const {password, ...userWithoutPassword} = user;
        return userWithoutPassword;
    }

}
