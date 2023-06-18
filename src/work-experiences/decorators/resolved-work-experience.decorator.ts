import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthorizedRequest } from '../../auth/interface/authorized-request.interface';
import { WorkExperience } from '../entities/work-experiences.entity';

export const ResolvedWorkExperience = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<
      AuthorizedRequest & {
        resolvedWorkExperience: WorkExperience | undefined;
      }
    >();

    if (request.resolvedWorkExperience === undefined) {
      throw new InternalServerErrorException(
        `Work experience couldn't be resolved`,
      );
    }

    return request.resolvedWorkExperience;
  },
);
