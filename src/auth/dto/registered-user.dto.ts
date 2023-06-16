import { OmitType } from '@nestjs/mapped-types';
import { User } from '../../users/entities/users.entity';

export class RegisteredUserDto extends OmitType(User, ['password']) {
  constructor({ id, username, updatedAt, createdAt }: RegisteredUserDto) {
    super();

    this.id = id;
    this.username = username;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
