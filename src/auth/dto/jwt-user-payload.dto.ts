import { PickType } from '@nestjs/mapped-types';
import { User } from '../../users/entities/users.entity';

export class JwtUserPayloadDto extends PickType(User, ['username']) {
  /**
   * Subject identifier representing the user's ID.
   *
   * @example 1
   */
  sub: User['id'];

  /**
   * Issued at timestamp indicating when the token was generated.
   *
   * @example 1624096800
   */
  iat: number;

  /**
   * Expiration timestamp indicating when the token will expire.
   *
   * @example 1624097100
   */
  exp: number;
}
