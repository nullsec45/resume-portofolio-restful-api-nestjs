import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from '../../common/response/dto/success-response.dto';
import { FailedResponseDto } from '../../common/response/dto/failed-response.dto';

export const ApiAuth = () =>
  applyDecorators(
    ApiTags('auth'),
    ApiExtraModels(SuccessResponseDto, FailedResponseDto),
  );
