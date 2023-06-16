import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/users.entity';

export class CreateUserDto extends PickType(User, ['username', 'password']) {}
