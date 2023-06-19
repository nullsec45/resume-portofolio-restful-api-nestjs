import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from '../../common/response/dto/success-response.dto';
import { FailedResponseDto } from '../../common/response/dto/failed-response.dto';
import { JwtUserPayloadDto } from '../dto/jwt-user-payload.dto';
import { SuccessfulSignInDto } from '../dto/successful-sign-in.dto';
import { User } from '../../users/entities/users.entity';

export const ApiAuth = () =>
  applyDecorators(
    ApiTags('auth'),
    ApiExtraModels(
      SuccessResponseDto,
      FailedResponseDto,
      JwtUserPayloadDto,
      SuccessfulSignInDto,
      User,
    ),
  );
