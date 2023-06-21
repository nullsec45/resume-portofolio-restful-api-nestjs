import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewUserType } from './types/new-user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(newUser: NewUserType) {
    const user = this.usersRepository.create(newUser);

    return this.usersRepository.save(user);
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  deleteAll() {
    return this.usersRepository.delete({});
  }
}
