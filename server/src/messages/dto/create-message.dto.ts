import {IsNotEmpty} from "class-validator";

export class CreateMessageDto {
    @IsNotEmpty()
    content: string;
    @IsNotEmpty()
    senderId: number;
    @IsNotEmpty()
    roomId: number;
}
