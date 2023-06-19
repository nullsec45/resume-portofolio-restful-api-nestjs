import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FailedSchema } from '../../common/response/constants/failed-schema.constant';
import { SuccessResponseDto } from '../../common/response/dto/success-response.dto';
import { FailedResponseDto } from '../../common/response/dto/failed-response.dto';

export const ApiResume = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse(
      FailedSchema(`JWT token couldn't be found`, HttpStatus.UNAUTHORIZED),
    ),
    ApiTags('resumes'),
    ApiExtraModels(SuccessResponseDto, FailedResponseDto),
  );
