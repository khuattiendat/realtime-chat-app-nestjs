import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Message} from "../../messages/entities/message.entity";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: '255', nullable: true})
    name: string | null;

    @Column({default: false})
    isGroup: boolean;

    @ManyToMany(() => User, (user) => user.rooms)
    @JoinTable()
    members: User[];

    @OneToMany(() => Message, (message) => message.room)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;
}
