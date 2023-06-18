import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkExperience } from './entities/work-experiences.entity';

@Injectable()
export class WorkExperiencesService {
  constructor(
    @InjectRepository(WorkExperience)
    private readonly workExperiencesRepository: Repository<WorkExperience>,
  ) {}

  create(
    createWorkExperienceDto: CreateWorkExperienceDto &
      Pick<WorkExperience, 'resumeId' | 'companyLogo'>,
  ) {
    const workExperience = this.workExperiencesRepository.create(
      createWorkExperienceDto,
    );

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
