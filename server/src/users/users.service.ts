import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const passwordHash = bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = await passwordHash;
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }


    findOneById(id: number) {
        return this.usersRepository.findOne({where: {id}});
    }

    findByEmail(email: string) {
        return this.usersRepository.findOne({where: {email}});
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.findOneById(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (updateUserDto.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser && existingUser.id !== id) {
                throw new Error('Email already exists');
            }
        }

        const updatedUser = Object.assign(user, updateUserDto);

        return await this.usersRepository.save(updatedUser);
    }
    async findAll() {
        return this.usersRepository.find();
    }

}
