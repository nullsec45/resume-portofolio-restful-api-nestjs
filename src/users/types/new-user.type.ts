import { User } from '../entities/users.entity';

export type NewUserType = Pick<User, 'username' | 'password'>;
