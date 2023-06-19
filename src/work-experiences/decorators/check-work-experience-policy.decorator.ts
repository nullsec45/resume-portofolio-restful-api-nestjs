import { SetMetadata } from '@nestjs/common';
import { WorkExperienceAction } from '../enums/work-experience-action.enum';

export const CheckWorkExperiencePolicy = (action: WorkExperienceAction) =>
  SetMetadata('workExperiencePolicy', action);
