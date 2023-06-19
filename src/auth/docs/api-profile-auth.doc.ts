import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessSchema } from '../../common/response/constants/success-schema.constant';
import { JwtUserPayloadDto } from '../dto/jwt-user-payload.dto';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';

export const ApiProfileAuth = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse(SuccessSchema(JwtUserPayloadDto, HttpStatus.OK)),
    ApiUnauthorizedResponse(
      FailedSchema(`JWT token couldn't be found`, HttpStatus.UNAUTHORIZED),
    ),
  );
