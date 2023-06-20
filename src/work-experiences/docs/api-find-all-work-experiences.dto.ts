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

export const ApiFindAllWorkExperiences = () =>
  applyDecorators(
    ApiOkResponse(SuccessSchema(WorkExperience, HttpStatus.OK, true)),
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
