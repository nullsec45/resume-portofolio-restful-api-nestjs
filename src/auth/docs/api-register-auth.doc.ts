import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { User } from '../../users/entities/users.entity';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';

export const ApiRegisterAuth = () =>
  applyDecorators(
    ApiConsumes('application/json', 'application/x-www-form-urlencoded'),
    ApiCreatedResponse(SuccessSchema(User, HttpStatus.CREATED)),
    ApiBadRequestResponse(
      FailedSchema(
        'password and confirmPassword does not match',
        HttpStatus.BAD_REQUEST,
      ),
    ),
  );
