import {Injectable} from '@nestjs/common';
import {CreateRoomDto} from './dto/create-room.dto';
import {Room} from "./entities/room.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {redis} from "../utils/redis.provider";
import {User} from "../users/entities/user.entity";

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private roomRepo: Repository<Room>,
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {
    }

    create(createRoomDto: CreateRoomDto) {
        const {name, members} = createRoomDto;
        const room = this.roomRepo.create({
            name,
            isGroup: true,
            members: members.map(userId => ({id: userId})),
        });
        return this.roomRepo.save(room);
    }

    async createOrGetPrivateRoom(sender: number, receiver: number): Promise<any> {
        const rooms = await this.roomRepo
            .createQueryBuilder('rooms')
            .innerJoin('rooms.members', 'member')
            .where('rooms.isGroup = false')
            .andWhere('member.id IN (:...userIds)', {userIds: [sender, receiver]})
            .groupBy('rooms.id')
            .having('COUNT(DISTINCT member.id) = 2')
            .getMany();
        const userReceiver = await this.userRepo.findOne({where: {id: receiver}});
        if (rooms.length > 0) {
            return {
                userReceiver,
                room: rooms[0],
            };
        }
        const room = this.roomRepo.create({
            isGroup: false,
            name: null,
            members: [sender, receiver].map(userId => ({id: userId})),
        });

        const saveRoom = await this.roomRepo.save(room);
        return {
            userReceiver,
            room :saveRoom,
        }

    }

    async getOnlineUsersInRoom(memberIds: number[]): Promise<number[]> {
        const onlineIds: number[] = [];

        for (const userId of memberIds) {
            const online = await redis.scard(`user:${userId}:sockets`);
            if (online > 0) onlineIds.push(userId);
        }

        return onlineIds;
    }

    async getMembersInRoom(roomId: number): Promise<number[]> {
        const room = await this.roomRepo.findOne({
            where: {id: roomId},
            relations: ['members'],
        });

        if (!room) {
            throw new Error('Room not found');
        }

        return room.members.map(member => member.id);
    }

    async getMessageInRoom(roomId: number): Promise<Room> {
        const room = await this.roomRepo.findOne({
            where: {id: roomId},
            relations: ['messages', 'messages.sender'],
        });

        if (!room) {
            throw new Error('Room not found');
        }

        return room;
    }

    async getAllRooms(userId): Promise<Room[]> {
        return this.roomRepo.find({
            where: {
                members: {
                    id: userId,
                },
                isGroup: true,
            },
            relations: ['members', 'messages', 'messages.sender'],
        })
    }


}
