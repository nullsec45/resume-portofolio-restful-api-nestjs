import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resumes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumesRepository: Repository<Resume>,
  ) {}

  create(createResumeDto: CreateResumeDto & Pick<Resume, 'userId'>) {
    return this.resumesRepository.save(createResumeDto);
  }

  findAll() {
    return this.resumesRepository.find();
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
}
