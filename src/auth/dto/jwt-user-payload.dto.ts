import { PickType } from '@nestjs/mapped-types';
import { User } from '../../users/entities/users.entity';

export class JwtUserPayloadDto extends PickType(User, ['username']) {
  sub: User['id'];
  iat: number;
  exp: number;
}
