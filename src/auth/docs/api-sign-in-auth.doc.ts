import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { SuccessfulSignInDto } from '../dto/successful-sign-in.dto';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';

export const ApiSignInAuth = () =>
  applyDecorators(
    ApiConsumes('application/json', 'application/x-www-form-urlencoded'),
    ApiOkResponse(SuccessSchema(SuccessfulSignInDto, HttpStatus.OK)),
    ApiUnauthorizedResponse(
      FailedSchema('Invalid username or password', HttpStatus.UNAUTHORIZED),
    ),
  );
