import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtUserPayloadDto } from './dto/jwt-user-payload.dto';
import { AuthorizedRequest } from './interfaces/authorized-request.interface';
import { User } from '../users/entities/users.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const signInDto: SignInDto = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
  const registerDto: RegisterDto = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    confirmPassword: faker.internet.password(),
  };
  const jwtUserPayloadDto: JwtUserPayloadDto = {
    sub: faker.number.int(),
    username: faker.internet.userName(),
    exp: faker.date.anytime().getTime(),
    iat: faker.date.anytime().getTime(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return { signIn: jest.fn(), register: jest.fn() };
        }

        if (token === JwtService) {
          return { verifyAsync: Promise.resolve };
        }
      })
      .compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
  });

  describe('signIn', () => {
    it('should call signIn method in authService and return its value', async () => {
      const token = { accessToken: faker.string.alphanumeric(10) };
      const signIn = jest.spyOn(authService, 'signIn');
      jest.spyOn(authService, 'signIn').mockReturnValue(Promise.resolve(token));

      const signedIn = await authController.signIn(signInDto);

      expect(signIn).toHaveBeenCalledWith(signInDto);
      expect(signedIn).toBe(token);
    });
  });

  describe('register', () => {
    it('should call register method in authService and return its value', async () => {
      const user = { username: registerDto.username } as User;
      const register = jest.spyOn(authService, 'register');
      jest
        .spyOn(authService, 'register')
        .mockReturnValue(Promise.resolve(user));

      const registered = await authController.register(registerDto);

      expect(register).toHaveBeenCalledWith(registerDto);
      expect(registered).toBe(user);
    });
  });

  describe('profile', () => {
    it('should return current jwt user payload', () => {
      const request = {
        user: jwtUserPayloadDto,
      } as AuthorizedRequest;

      const payload = authController.profile(request);

      expect(payload).toEqual(jwtUserPayloadDto);
    });
  });
});
