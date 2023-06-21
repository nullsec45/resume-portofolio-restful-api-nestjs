import { CreateResumeDto } from '../dto/create-resume.dto';
import { Resume } from '../entities/resumes.entity';

export type NewResume = CreateResumeDto &
  Pick<Resume, 'userId' | 'profilePicture'>;
