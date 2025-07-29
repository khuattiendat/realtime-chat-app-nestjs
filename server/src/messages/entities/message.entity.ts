import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Room} from "../../rooms/entities/room.entity";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.messages)
    sender: User;

    @ManyToOne(() => Room, (room) => room.messages)
    room: Room;

    @CreateDateColumn()
    createdAt: Date;
}
