import {Controller, Get, Post, Body, Patch, Param, Delete, Response, Put, UseGuards, Request} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {responseApi} from "../utils/responseApi";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(JwtAuthGuard)
    @Put('/update/:id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Response() res) {
        try {
            const user = await this.usersService.update(+id, updateUserDto);
            const {password, ...userWithoutPassword} = user;
            return res.status(200).json(responseApi(200, userWithoutPassword, 'User updated successfully'));
        } catch (error) {
            return res.status(500).json(responseApi(400, null, error.message || 'Error logging in'));
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get-all')
    async findAll(@Response() res: any, @Request() req: any) {
        try {
            const userLoginTed = req.user;
            const allUser = await this.usersService.findAll();
            const users = allUser.filter(user => user.id !== userLoginTed.id);
            return res.status(200).json(responseApi(200, users, 'Users retrieved successfully'));
        } catch (error) {
            return res.status(500).json(responseApi(400, null, error.message || 'Error retrieving users'));
        }
    }
}
