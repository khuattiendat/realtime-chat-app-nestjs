// auth.controller.ts
import {
    Controller,
    Post,
    Body,
    Request,
    UseGuards,
    Get,
    Response,
    Res,
    UnauthorizedException,
    Param
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {responseApi} from "../utils/responseApi";
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly userService: UsersService,
                private jwtService: JwtService,
    ) {
    }

    @Post('/register')
    async create(@Body() createUserDto: CreateUserDto, @Response() res: any) {
        try {
            const user = await this.userService.create(createUserDto);
            return res.status(201).json(responseApi(201, user, 'User created successfully'));
        } catch (error) {
            return res.status(400).json(responseApi(400, null, error.message || 'Error creating user'));
        }
    }

    @Post('/login')
    async login(@Body() login: LoginDto, @Response() res: any) {
        try {
            const user = await this.authService.validateUser(login.email, login.password);
            if (!user) {
                return res.status(401).json(responseApi(401, null, 'Invalid credentials'));
            }
            return res.status(200).json(responseApi(200, await this.authService.login(user), 'Login successful'));
        } catch (error) {
            return res.status(500).json(responseApi(400, null, error.message || 'Error logging in'));
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/change-password/:id')
    async changePassword(@Param('id') id: string, @Body() body: {
        oldPassword: string,
        newPassword: string
    }, @Response() res: any) {
        try {
            await this.authService.changePassword(+id, body.oldPassword, body.newPassword);
            return res.status(200).json(responseApi(200, null, 'Password changed successfully'));
        } catch (error) {
            return res.status(500).json(responseApi(400, null, error.message || 'Error changing password'));
        }
    }

    @Post('/refresh')
    async refreshToken(@Body() body: { refreshToken: string }, @Response() res: any) {
        try {
            const token = await this.jwtService.verify(body.refreshToken, {
                secret: process.env.JWT_SECRET
            });
            const user = await this.userService.findByEmail(token.email);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const {messages, rooms, password, ...other} = user;
            const payload = {...other};
            const newAccessToken = this.jwtService.sign(payload,
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '1m',
                }
            );
            return res.status(200).json(responseApi(200, {accessToken: newAccessToken}, 'Token refreshed successfully'));
        } catch (e) {
            return res.status(500).json(responseApi(400, null, e.message || 'Error logging in'));
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any, @Res() res: any) {
        try {
            const user = req.user;
            const userProfile = await this.authService.getProfile(user.id);
            return res.status(200).json(responseApi(200, userProfile, 'User profile retrieved successfully'));
        } catch (error) {
            return res.status(500).json(responseApi(400, null, error.message || 'Error retrieving profile'));
        }
    }
}
