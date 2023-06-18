import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Match(RegisterDto, (dto) => dto.password, {
    message: 'password and confirmPassword does not match',
  })
  confirmPassword: string;
}
