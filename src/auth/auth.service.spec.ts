import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const signInDto: SignInDto = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
  const registerDto: RegisterDto = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    confirmPassword: faker.internet.password(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { findOneByUsername: jest.fn(), create: jest.fn() };
        }

        if (token === JwtService) {
          return { signAsync: jest.fn() };
        }
      })
      .compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('signIn', () => {
    it('should throw unauthorized exception if username or password is invalid', async () => {
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockReturnValue(
          Promise.resolve({ password: signInDto.password } as User),
        );

      const callService = async () => await authService.signIn(signInDto);

      await expect(callService).rejects.toThrow(UnauthorizedException);
    });

    it('should return an object containing access token on success', async () => {
      const id = faker.number.int();
      const username = signInDto.username;
      const password = signInDto.password;
      const hashed = await bcrypt.hash(password, 1);
      const token = faker.string.alphanumeric(10);
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockReturnValue(
          Promise.resolve({ password: hashed, username, id } as User),
        );
      jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(Promise.resolve(token));

      const signedIn = await authService.signIn(signInDto);

      expect(signedIn).toHaveProperty('accessToken');
      expect(signedIn.accessToken).toBe(token);
    });
  });

  describe('register', () => {
    it('should throw bad request exception if username is already used', async () => {
      const username = registerDto.username;
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockReturnValue(Promise.resolve({ username } as User));

      const callService = async () => await authService.register(registerDto);

      await expect(callService).rejects.toThrow(BadRequestException);
    });

    it('should return created user on success', async () => {
      const username = registerDto.username;
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockReturnValue(Promise.resolve(null));
      jest
        .spyOn(usersService, 'create')
        .mockReturnValue(Promise.resolve({ username } as User));

      const createdUser = await authService.register(registerDto);

      expect(createdUser.username).toBe(registerDto.username);
    });
  });
});
