import { User } from '../../users/entities/users.entity';

export type JwtUserPayload = Pick<User, 'username'> & {
  sub: User['id'];
  iat: number;
  exp: number;
};
