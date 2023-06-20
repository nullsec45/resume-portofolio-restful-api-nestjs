import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { WorkExperience } from '../entities/work-experiences.entity';

export const ApiUpdateWorkExperience = () =>
  applyDecorators(
    ApiConsumes(
      'multipart/form-data',
      'application/x-www-form-urlencoded',
      'application/json',
    ),
    ApiOkResponse(SuccessSchema(WorkExperience, HttpStatus.OK)),
    ApiBadRequestResponse(
      FailedSchema(
        ':workExperienceId should be a number',
        HttpStatus.BAD_REQUEST,
      ),
    ),
    ApiNotFoundResponse(
      FailedSchema('Work experience with id 1 not found', HttpStatus.NOT_FOUND),
    ),
    ApiForbiddenResponse(
      FailedSchema('Forbidden resource', HttpStatus.FORBIDDEN),
    ),
    ApiParam({ name: 'workExperienceId', type: Number }),
  );
