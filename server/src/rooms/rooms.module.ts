import {Module} from '@nestjs/common';
import {RoomsService} from './rooms.service';
import {RoomsController} from './rooms.controller';
import {Room} from "./entities/room.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "../messages/entities/message.entity";
import {User} from "../users/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Room, Message, User])],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService],
})
export class RoomsModule {
}
