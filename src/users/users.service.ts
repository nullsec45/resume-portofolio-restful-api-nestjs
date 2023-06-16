import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(user: Pick<User, 'username' | 'password'>) {
    return this.usersRepository.save(user);
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
