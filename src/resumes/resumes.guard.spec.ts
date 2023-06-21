import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { ResumesGuard } from './resumes.guard';
import { ResumesService } from './resumes.service';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ResumeAction } from './enums/resume-action.enum';
import { faker } from '@faker-js/faker';
import { Resume } from './entities/resumes.entity';

describe('ResumesGuard', () => {
  let context: ExecutionContext;
  let resumesGuard: ResumesGuard;
  let resumesService: ResumesService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ResumesGuard],
    })
      .useMocker((token) => {
        if (token === ResumesService) {
          return { findOneOrFail: jest.fn() };
        }

        if (token === Reflector) {
          return {};
        }
      })
      .compile();

    context = new ExecutionContextHost([]);
    resumesGuard = module.get(ResumesGuard);
    resumesService = module.get(ResumesService);
    reflector = module.get(Reflector);
  });

  it('should pass guard if resume id not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const guard = await resumesGuard.canActivate(context);

    expect(guard).toBe(true);
  });

  it('should throw bad request exception if resume id is not a number', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(ResumeAction.Manage);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: () => ({
          user: { sub: faker.number.int() },
          params: { resumeId: faker.string.alpha() },
        }),
      }),
    );

    const callGuard = async () => await resumesGuard.canActivate(context);

    await expect(callGuard).rejects.toThrow(BadRequestException);
  });

  it('should fail if tries to access a restricted resource', async () => {
    const userId = faker.number.int();

    jest.spyOn(reflector, 'get').mockReturnValue(ResumeAction.Manage);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: () => ({
          user: { sub: userId },
          params: { resumeId: faker.number.int() },
        }),
      }),
    );
    jest
      .spyOn(resumesService, 'findOneOrFail')
      .mockReturnValue(
        Promise.resolve({ userId: faker.number.int() } as Resume),
      );

    const guard = await resumesGuard.canActivate(context);

    expect(guard).toBe(false);
  });

  it('should pass if has permission to access the resource', async () => {
    const userId = faker.number.int();

    jest.spyOn(reflector, 'get').mockReturnValue(ResumeAction.Manage);
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: () => ({
          user: { sub: userId },
          params: { resumeId: faker.number.int() },
        }),
      }),
    );
    jest
      .spyOn(resumesService, 'findOneOrFail')
      .mockReturnValue(Promise.resolve({ userId } as Resume));

    const guard = await resumesGuard.canActivate(context);

    expect(guard).toBe(true);
  });
});
