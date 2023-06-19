import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SuccessfulSignInDto } from './dto/successful-sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByUsername(signInDto.username);

    if (
      user === null ||
      (await bcrypt.compare(signInDto.password, user?.password)) === false
    ) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id, username: user.username };

    return new SuccessfulSignInDto({
      accessToken: await this.jwtService.signAsync(payload),
    });
  }

  async register(registerDto: RegisterDto) {
    const userWithSameUsername = await this.usersService.findOneByUsername(
      registerDto.username,
    );

    if (userWithSameUsername !== null) {
      throw new BadRequestException(
        `${registerDto.username} username already taken by another user`,
      );
    }

    const createdUser = await this.usersService.create({
      username: registerDto.username,
      password: await bcrypt.hash(registerDto.password, 8),
    });

    return createdUser;
  }
}
