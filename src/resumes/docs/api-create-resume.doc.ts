import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { Resume } from '../entities/resumes.entity';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';

export const ApiCreateResume = () =>
  applyDecorators(
    ApiConsumes(
      'multipart/form-data',
      'application/x-www-form-urlencoded',
      'application/json',
    ),
    ApiCreatedResponse(SuccessSchema(Resume, HttpStatus.CREATED)),
    ApiBadRequestResponse(
      FailedSchema(['name must be a string'], HttpStatus.BAD_REQUEST),
    ),
  );
