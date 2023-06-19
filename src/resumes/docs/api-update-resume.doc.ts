import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Resume } from '../entities/resumes.entity';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';

export const ApiUpdateResume = () =>
  applyDecorators(
    ApiConsumes(
      'multipart/form-data',
      'application/x-www-form-urlencoded',
      'application/json',
    ),
    ApiOkResponse(SuccessSchema(Resume, HttpStatus.OK)),
    ApiBadRequestResponse(
      FailedSchema(':resumeId should be a number', HttpStatus.BAD_REQUEST),
    ),
    ApiNotFoundResponse(
      FailedSchema('Resume with id 1 not found', HttpStatus.NOT_FOUND),
    ),
    ApiForbiddenResponse(
      FailedSchema('Forbidden resource', HttpStatus.FORBIDDEN),
    ),
    ApiParam({ name: 'resumeId', type: Number }),
  );
