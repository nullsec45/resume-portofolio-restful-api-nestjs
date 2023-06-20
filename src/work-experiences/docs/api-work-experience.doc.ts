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
import { WorkExperience } from '../entities/work-experiences.entity';

export const ApiWorkExperience = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse(
      FailedSchema(`JWT token couldn't be found`, HttpStatus.UNAUTHORIZED),
    ),
    ApiTags('work-experiences'),
    ApiExtraModels(SuccessResponseDto, FailedResponseDto, WorkExperience),
  );
