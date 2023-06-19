import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class RegisterDto {
  /**
   * The username to be created, the username must be unique and not used by other users.
   *
   * @example "johndoe123"
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  username: string;

  /**
   * The user password.
   *
   * @example "12345678"
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  /**
   * The user user password confirmation, this field must be the same as the password field.
   *
   * @example "12345678"
   */
  @Match(RegisterDto, (dto) => dto.password, {
    message: 'password and confirmPassword does not match',
  })
  confirmPassword: string;
}
