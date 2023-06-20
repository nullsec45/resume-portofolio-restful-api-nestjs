import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';

export const ApiDeleteWorkExperience = () =>
  applyDecorators(
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
