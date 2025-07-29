import {Injectable} from '@nestjs/common';
import {CreateMessageDto} from './dto/create-message.dto';
import {UpdateMessageDto} from './dto/update-message.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Message} from "./entities/message.entity";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {
    }

    async create(createMessageDto: CreateMessageDto) {
        const message = this.messageRepository.create(createMessageDto);
        const newMessage = await this.messageRepository.save({
            ...message,
            sender: {id: createMessageDto.senderId},
            room: {id: createMessageDto.roomId},
        });
        return await this.messageRepository.findOne({
            where: {id: newMessage.id},
            relations: ['sender', 'room'],
        });
    }

}
