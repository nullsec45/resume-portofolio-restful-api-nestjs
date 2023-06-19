import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  /**
   * The username of the user.
   *
   * @example "johndoe123"
   */
  @IsNotEmpty()
  @IsString()
  username: string;

  /**
   * The password of the user.
   *
   * @example "12345678"
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}
