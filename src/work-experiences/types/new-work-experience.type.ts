import { CreateWorkExperienceDto } from '../dto/create-work-experience.dto';
import { WorkExperience } from '../entities/work-experiences.entity';

export type NewWorkExperience = CreateWorkExperienceDto &
  Pick<WorkExperience, 'resumeId' | 'companyLogo'>;
