import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';
import { WorkExperience } from '../entities/work-experiences.entity';

export const ApiCreateWorkExperience = () =>
  applyDecorators(
    ApiConsumes(
      'multipart/form-data',
      'application/x-www-form-urlencoded',
      'application/json',
    ),
    ApiCreatedResponse(SuccessSchema(WorkExperience, HttpStatus.CREATED)),
    ApiBadRequestResponse(
      FailedSchema(':resumeId should be a number', HttpStatus.BAD_REQUEST),
    ),
    ApiNotFoundResponse(
      FailedSchema('Resume with id 1 not found', HttpStatus.NOT_FOUND),
    ),
    ApiForbiddenResponse(
      FailedSchema('Forbidden resource', HttpStatus.FORBIDDEN),
    ),
  );
