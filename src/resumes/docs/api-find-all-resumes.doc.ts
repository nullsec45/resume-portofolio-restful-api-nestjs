import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { Resume } from '../entities/resumes.entity';

export const ApiFindAllResumes = () =>
  applyDecorators(ApiOkResponse(SuccessSchema(Resume, HttpStatus.OK, true)));
