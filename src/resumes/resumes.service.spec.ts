import { Test } from '@nestjs/testing';
import { ResumesService } from './resumes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resume } from './entities/resumes.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('ResumesService', () => {
  let resumesService: ResumesService;
  let resumesRepository: Repository<Resume>;

  beforeEach(async () => {
    const resumeToken = getRepositoryToken(Resume);
    const module = await Test.createTestingModule({
      providers: [
        ResumesService,
        {
          provide: resumeToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    resumesService = module.get(ResumesService);
    resumesRepository = module.get(resumeToken);
  });

  describe('create', () => {
    it('should be able to create new resume and return its value', async () => {
      const resume = {
        name: faker.person.fullName(),
      } as Resume;
      jest
        .spyOn(resumesRepository, 'save')
        .mockReturnValue(Promise.resolve(resume));

      const created = await resumesService.create(resume);

      expect(created).toBe(resume);
    });
  });

  describe('findAllByUserId', () => {
    it('should be able to find all resumes by user id and return as array', async () => {
      const resumes = [
        { name: faker.person.fullName() },
        { name: faker.person.fullName() },
      ] as Resume[];
      jest
        .spyOn(resumesRepository, 'findBy')
        .mockReturnValue(Promise.resolve(resumes));

      const resumesFound = await resumesService.findAllByUserId(
        faker.number.int(),
      );

      expect(resumesFound).toBe(resumes);
    });
  });

  describe('findOne', () => {
    it('should be able to find and return a resume by id', async () => {
      const resume = {
        name: faker.person.fullName(),
      } as Resume;
      jest
        .spyOn(resumesRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(resume));

      const resumeFound = await resumesService.findOne(faker.number.int());

      expect(resumeFound).toBe(resume);
    });
  });

  describe('findOneOrFail', () => {
    it('should throw not found exception if resume is empty', async () => {
      const resume = null;
      jest
        .spyOn(resumesRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(resume));

      const findResume = async () =>
        await resumesService.findOneOrFail(faker.number.int());

      await expect(findResume).rejects.toThrow(NotFoundException);
    });

    it('should be able to return a resume if not empty', async () => {
      const resume = {
        name: faker.person.fullName(),
      } as Resume;
      jest
        .spyOn(resumesRepository, 'findOneBy')
        .mockReturnValue(Promise.resolve(resume));

      const resumeFound = await resumesService.findOneOrFail(
        faker.number.int(),
      );

      expect(resumeFound).toBe(resume);
    });
  });

  describe('save', () => {
    it('should be able to save resume and return its value', async () => {
      const resume = {
        name: faker.person.fullName(),
      } as Resume;
      jest
        .spyOn(resumesRepository, 'save')
        .mockReturnValue(Promise.resolve(resume));

      const savedResume = await resumesService.save(resume);

      expect(savedResume).toBe(resume);
    });
  });
});
