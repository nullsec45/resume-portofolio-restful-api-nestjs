import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SuccessResponseDto } from '../src/common/response/dto/success-response.dto';
import { globalValidation } from '../src/common/validators/pipes/global-validation.pipe';
import { Resume } from '../src/resumes/entities/resumes.entity';
import { UsersService } from '../src/users/users.service';
import { createFakeUser } from './utils/create-fake-user.util';
import { ResumesService } from '../src/resumes/resumes.service';

describe('ResumesController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let resumesService: ResumesService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.register('.env.testing')],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(globalValidation);

    usersService = app.get(UsersService);
    resumesService = app.get(ResumesService);
    jwtService = app.get(JwtService);

    await app.init();
  });

  beforeEach(async () => {
    await usersService.deleteAll();
    await resumesService.deleteAll();
  });

  describe('/resumes (POST)', () => {
    it('should return created response if resume is successfully created', async () => {
      const name = faker.person.fullName() + ' ' + faker.company.name();
      const age = faker.number.int({ min: 22, max: 50 });
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
        .post('/resumes')
        .set('Authorization', `Bearer ${token}`)
        .send({ name, age });

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining<SuccessResponseDto>({
          data: expect.objectContaining<Partial<Resume>>({
            age,
            name,
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            profilePicture: null,
            userId: expect.any(Number),
          }),
          message: expect.any(String),
          statusCode: expect.any(Number),
        }),
      );
    });

    it(`should return bad request response if data doesn't pass validation`, async () => {
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
        .post('/resumes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return unauthorized response if jwt token is not provided', async () => {
      const response = await request(app.getHttpServer()).post('/resumes');

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/resumes (GET)', () => {
    it('should return ok response if resumes are successfully fetched', async () => {
      const { username, password } = createFakeUser();
      const user = await usersService.create({
        username,
        password: await bcrypt.hash(password, 1),
      });
      const token = await jwtService.signAsync({
        sub: user.id,
        username: username,
      });
      resumesService.creates([
        {
          userId: user.id,
          name: faker.person.fullName() + ' ' + faker.company.name(),
          age: faker.number.int({ min: 22, max: 50 }),
          profilePicture: null,
        },
        {
          userId: user.id,
          name: faker.person.fullName() + ' ' + faker.company.name(),
          age: faker.number.int({ min: 22, max: 50 }),
          profilePicture: null,
        },
      ]);

      const response = await request(app.getHttpServer())
        .get('/resumes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining<SuccessResponseDto>({
          data: expect.arrayContaining([
            expect.objectContaining<Partial<Resume>>({
              age: expect.any(Number),
              name: expect.any(String),
              id: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              profilePicture: null,
              userId: expect.any(Number),
            }),
          ]),
          message: expect.any(String),
          statusCode: expect.any(Number),
        }),
      );
    });

    it('should return unauthorized response if jwt token is not provided', async () => {
      const response = await request(app.getHttpServer()).get('/resumes');

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/resumes/:resumeId (GET)', () => {
    // TODO: add bad request case
    // TODO: add forbidden case

    it('should return ok response if resume is successfully fetched', async () => {
      const { username, password } = createFakeUser();
      const user = await usersService.create({
        username,
        password: await bcrypt.hash(password, 1),
      });
      const token = await jwtService.signAsync({
        sub: user.id,
        username: username,
      });
      const resume = await resumesService.create({
        userId: user.id,
        name: faker.person.fullName() + ' ' + faker.company.name(),
        age: faker.number.int({ min: 22, max: 50 }),
        profilePicture: null,
      });

      const response = await request(app.getHttpServer())
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining<SuccessResponseDto>({
          data: expect.objectContaining<Partial<Resume>>({
            age: expect.any(Number),
            name: expect.any(String),
            id: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            profilePicture: null,
            userId: expect.any(Number),
          }),
          message: expect.any(String),
          statusCode: expect.any(Number),
        }),
      );
    });

    it('should return not found response if resume not available', async () => {
      const resumeId = faker.number.int();
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
        .get(`/resumes/${resumeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return unauthorized response if jwt token is not provided', async () => {
      const resumeId = faker.number.int();

      const response = await request(app.getHttpServer()).get(
        `/resumes/${resumeId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/resumes/:resumeId (PATCH)', () => {
    // TODO: add bad request case
    // TODO: add forbidden case
    // TODO: add ok case

    it('should return not found response if resume not available', async () => {
      const resumeId = faker.number.int();
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
        .patch(`/resumes/${resumeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return unauthorized response if jwt token is not provided', async () => {
      const resumeId = faker.number.int();

      const response = await request(app.getHttpServer()).patch(
        `/resumes/${resumeId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/resumes/:resumeId (DELETE)', () => {
    // TODO: add bad request case
    // TODO: add forbidden case
    // TODO: add ok no content case

    it('should return not found response if resume not available', async () => {
      const resumeId = faker.number.int();
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
        .delete(`/resumes/${resumeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return unauthorized response if jwt token is not provided', async () => {
      const resumeId = faker.number.int();

      const response = await request(app.getHttpServer()).delete(
        `/resumes/${resumeId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
