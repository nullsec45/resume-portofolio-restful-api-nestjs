import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SuccessResponseDto } from '../src/common/response/dto/success-response.dto';
import { globalValidation } from '../src/common/validators/pipes/global-validation.pipe';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtUserPayloadDto } from '../src/auth/dto/jwt-user-payload.dto';
import { User } from '../src/users/entities/users.entity';
import { SuccessfulSignInDto } from '../src/auth/dto/successful-sign-in.dto';
import { createFakeUser } from './utils/create-fake-user.util';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.register('.env.testing')],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(globalValidation);

    usersService = app.get(UsersService);
    jwtService = app.get(JwtService);

    await app.init();
  });

  beforeEach(async () => {
    await usersService.deleteAll();
  });

  describe('/auth/login (POST)', () => {
    it('should return response containing access token on success', async () => {
      const { username, password } = createFakeUser();
      await usersService.create({
        username,
        password: await bcrypt.hash(password, 1),
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username, password });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining<SuccessResponseDto>({
          data: expect.objectContaining<SuccessfulSignInDto>({
            accessToken: expect.stringMatching(
              /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
            ),
          }),
          message: expect.any(String),
          statusCode: expect.any(Number),
        }),
      );
    });

    it('should return unauthorized response if username or password invalid', async () => {
      const { username, password } = createFakeUser();

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username, password });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/auth/register (POST)', () => {
    it('should return created response if user is successfully created', async () => {
      const { username, password } = createFakeUser();

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ username, password, confirmPassword: password });

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining<SuccessResponseDto>({
          data: expect.objectContaining<Partial<User>>({
            username,
          }),
          message: expect.any(String),
          statusCode: expect.any(Number),
        }),
      );
    });

    it(`should return bad request response if data doesn't pass validation`, async () => {
      const response = await request(app.getHttpServer()).post(
        '/auth/register',
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should return current jwt payload when authenticated', async () => {
      const { username, password } = createFakeUser();
      const user = await usersService.create({
        username,
        password: await bcrypt.hash(password, 1),
      });
      const token = await jwtService.signAsync({
        sub: user.id,
        username: username,
      });

      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining<SuccessResponseDto>({
          data: expect.objectContaining<JwtUserPayloadDto>({
            username,
            sub: expect.any(Number),
            exp: expect.any(Number),
            iat: expect.any(Number),
          }),
          message: expect.any(String),
          statusCode: expect.any(Number),
        }),
      );
    });

    it('should return unauthorized response if jwt token is invalid', async () => {
      const response = await request(app.getHttpServer()).get('/auth/profile');

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
