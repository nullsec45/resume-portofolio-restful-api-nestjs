import { Test } from '@nestjs/testing';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { JwtUserPayloadDto } from '../auth/dto/jwt-user-payload.dto';
import { faker } from '@faker-js/faker';
import { AuthorizedRequest } from '../auth/interfaces/authorized-request.interface';
import { CreateResumeDto } from './dto/create-resume.dto';
import { Resume } from './entities/resumes.entity';
import { JwtService } from '@nestjs/jwt';

describe('ResumeController', () => {
  let resumesController: ResumesController;
  let resumesService: ResumesService;

  const createResumeDto: CreateResumeDto = {
    name: faker.person.fullName(),
    age: faker.number.int({ min: 22, max: 50 }),
    profilePicture: null,
  };
  const jwtUserPayloadDto: JwtUserPayloadDto = {
    sub: faker.number.int(),
    username: faker.internet.userName(),
    exp: faker.date.anytime().getTime(),
    iat: faker.date.anytime().getTime(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ResumesController],
    })
      .useMocker((token) => {
        if (token === ResumesService) {
          return {
            findOneOrFail: jest.fn(),
            register: jest.fn(),
            create: jest.fn(),
            findAllByUserId: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          };
        }

        if (token === JwtService) {
          return { verifyAsync: Promise.resolve };
        }
      })
      .compile();

    resumesController = module.get(ResumesController);
    resumesService = module.get(ResumesService);
  });

  describe('create', () => {
    it('should call create method in resumesService and return its value', async () => {
      const request = { user: jwtUserPayloadDto } as AuthorizedRequest;
      const createResume = jest.spyOn(resumesService, 'create');
      createResume.mockReturnValue(
        Promise.resolve({ name: createResumeDto.name } as Resume),
      );

      const created = await resumesController.create(
        request,
        createResumeDto,
        undefined,
      );

      expect(createResume).toHaveBeenCalled();
      expect(created).toEqual(
        expect.objectContaining({
          name: createResumeDto.name,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should call findAllByUserId method in resumesService and return its value', async () => {
      const request = { user: jwtUserPayloadDto } as AuthorizedRequest;
      const findAllResumeByUserId = jest.spyOn(
        resumesService,
        'findAllByUserId',
      );
      findAllResumeByUserId.mockReturnValue(Promise.resolve([]));

      const resumes = await resumesController.findAll(request);

      expect(findAllResumeByUserId).toHaveBeenCalled();
      expect(resumes).toEqual([]);
    });
  });

  describe('update', () => {
    it('should call save method in resumesService and return its value', async () => {
      const resume = {} as Resume;
      const saveResume = jest.spyOn(resumesService, 'save');
      saveResume.mockReturnValue(
        Promise.resolve({ name: createResumeDto.name } as Resume),
      );

      const updated = await resumesController.update(
        resume,
        createResumeDto,
        undefined,
      );

      expect(saveResume).toHaveBeenCalled();
      expect(updated).toEqual(
        expect.objectContaining({
          name: createResumeDto.name,
        }),
      );
    });
  });

  describe('remove', () => {
    it('should call remove method in resumesService and return its value', async () => {
      const resumeId = faker.number.int();
      const removeResume = jest.spyOn(resumesService, 'remove');

      await resumesController.remove(resumeId);

      expect(removeResume).toHaveBeenCalledWith(resumeId);
    });
  });
});
