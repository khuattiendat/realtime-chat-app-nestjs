import {Controller, Get, Post, Body, Patch, Param, Delete, Response, Request, UseGuards} from '@nestjs/common';
import {RoomsService} from './rooms.service';
import {CreateRoomDto} from './dto/create-room.dto';
import {UpdateRoomDto} from './dto/update-room.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    create(@Body() createRoomDto: CreateRoomDto, @Request() req: any, @Response() res: any) {
        try {
            const loginTedUser = req.user;
            createRoomDto.members.push(loginTedUser.id)
            const room = this.roomsService.create(createRoomDto);
            res.status(201).json({
                message: 'Room created successfully',
                data: room,
            });
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({
                message: 'Error creating room',
                error: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-all')
    async findAll(@Request() req: any, @Response() res: any) {
        try {
            const loginTedUser = req.user;
            const rooms = await this.roomsService.getAllRooms(loginTedUser.id);
            res.status(200).json({
                message: 'Rooms retrieved successfully',
                data: rooms,
            });
        } catch (error) {
            console.error('Error retrieving rooms:', error);
            res.status(500).json({
                message: 'Error retrieving rooms',
                error: error.message,
            });
        }
    }


    @Post('private-message')
    async createOrGetPrivateRoom(
        @Body('sender') sender: number,
        @Body('receiver') receiver: number,
        @Response() res: any
    ) {
        try {
            const data = await this.roomsService.createOrGetPrivateRoom(sender, receiver);
            res.status(200).json({
                message: 'Private room created or retrieved successfully',
                data: data,
            });
        } catch (error) {
            console.error('Error creating or getting private room:', error);
            res.status(500).json({
                message: 'Error creating or getting private room',
                error: error.message,
            });
        }
    }

@Get('get-messages/:roomId')
    async getMessageInRoom(@Param('roomId') roomId: number, @Response() res: any) {
        try {
            const messages = await this.roomsService.getMessageInRoom(roomId);
            res.status(200).json({
                message: 'Message retrieved successfully',
                data: messages,
            });
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).json({
                message: 'Error retrieving messages',
                error: error.message,
            });
        }
    }


}
