import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthorizedRequest } from '../../auth/interface/authorized-request.interface';
import { Resume } from '../entities/resumes.entity';

export const ResolvedResume = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<AuthorizedRequest & { resolvedResume: Resume | undefined }>();

    if (request.resolvedResume === undefined) {
      throw new InternalServerErrorException(`Resume couldn't be resolved`);
    }

    return request.resolvedResume;
  },
);
