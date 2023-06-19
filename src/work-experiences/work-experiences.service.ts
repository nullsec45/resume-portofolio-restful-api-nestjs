import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkExperience } from './entities/work-experiences.entity';
import { NewWorkExperience } from './types/new-work-experience.type';

@Injectable()
export class WorkExperiencesService {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperiencesRepository: Repository<WorkExperience>,
  ) {}

  create(newWorkExperience: NewWorkExperience) {
    const workExperience =
      this.workExperiencesRepository.create(newWorkExperience);

    return this.workExperiencesRepository.save(workExperience);
  }

  findAllByResumeId(resumeId: number) {
    return this.workExperiencesRepository.findBy({ resumeId });
  }

  findOne(id: number) {
    return this.workExperiencesRepository.findOne({
      relations: { resume: true },
      where: { id },
    });
  }

  async findOneOrFail(id: number) {
    const workExperience = await this.findOne(id);

    if (workExperience === null) {
      throw new NotFoundException(`Work experience with id ${id} not found`);
    }

    return workExperience;
  }

  save(workExperience: WorkExperience) {
    return this.workExperiencesRepository.save(workExperience);
  }

  remove(id: number) {
    return this.workExperiencesRepository.delete({ id });
  }
}
