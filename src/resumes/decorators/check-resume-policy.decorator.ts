import { SetMetadata } from '@nestjs/common';
import { ResumeAction } from '../enums/resume-action.enum';

export const CheckResumePolicy = (action: ResumeAction) =>
  SetMetadata('resumePolicy', action);
