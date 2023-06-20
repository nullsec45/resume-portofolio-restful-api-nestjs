import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { WorkExperience } from '../entities/work-experiences.entity';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';

export const ApiFindOneWorkExperience = () =>
  applyDecorators(
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
