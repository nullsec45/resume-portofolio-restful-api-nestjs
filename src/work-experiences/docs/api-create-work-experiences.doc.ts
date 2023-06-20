import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';
import { WorkExperience } from '../entities/work-experiences.entity';

export const ApiCreateWorkExperiences = () =>
  applyDecorators(
    ApiCreatedResponse(SuccessSchema(WorkExperience, HttpStatus.CREATED, true)),
    ApiBadRequestResponse(
      FailedSchema(
        ['The length of startDate must be equal to the length of jobTitle.'],
        HttpStatus.BAD_REQUEST,
      ),
    ),
    ApiNotFoundResponse(
      FailedSchema('Resume with id 1 not found', HttpStatus.NOT_FOUND),
    ),
    ApiForbiddenResponse(
      FailedSchema('Forbidden resource', HttpStatus.FORBIDDEN),
    ),
  );
