import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resumes.entity';
import { Repository } from 'typeorm';
import { NewResume } from './types/new-resume.type';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumesRepository: Repository<Resume>,
  ) {}

  create(createResumeDto: NewResume) {
    const resume = this.resumesRepository.create(createResumeDto);

    return this.resumesRepository.save(resume);
  }

  async creates(newResumes: NewResume[]) {
    const resumes = this.resumesRepository.create(newResumes);

    await this.resumesRepository.insert(resumes);

    return resumes;
  }

  findAllByUserId(userId: number) {
    return this.resumesRepository.findBy({ userId });
  }

  findOne(id: number) {
    return this.resumesRepository.findOneBy({ id });
  }

  async findOneOrFail(id: number) {
    const resume = await this.findOne(id);

    if (resume === null) {
      throw new NotFoundException(`Resume with id ${id} not found`);
    }

    return resume;
  }

  save(resume: Resume) {
    return this.resumesRepository.save(resume);
  }

  remove(id: number) {
    return this.resumesRepository.delete({ id });
  }

  deleteAll() {
    return this.resumesRepository.delete({});
  }
}
