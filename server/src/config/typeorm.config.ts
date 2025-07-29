import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as process from "node:process";
import {User} from "../users/entities/user.entity";
import {Room} from "../rooms/entities/room.entity";
import {Message} from "../messages/entities/message.entity";

dotenv.config();
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Room, Message],
    synchronize: true,
};
