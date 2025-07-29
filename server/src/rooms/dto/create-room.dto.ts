import {IsNotEmpty} from "class-validator";

export class CreateRoomDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    members: number[];
}
