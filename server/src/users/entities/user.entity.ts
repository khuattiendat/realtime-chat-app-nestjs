import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {Message} from "../../messages/entities/message.entity";
import {Room} from "../../rooms/entities/room.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({default: false})
    isOnline: boolean;

    @Column({nullable: true})
    lastSeen: Date;

    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];

    @ManyToMany(() => Room, (room) => room.members)
    rooms: Room[];
}
