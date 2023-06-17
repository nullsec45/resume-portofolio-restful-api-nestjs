import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizedRequest } from '../auth/interface/authorized-request.interface';
import { ResumesService } from './resumes.service';
import ResumeAction from './enums/resume-action.enum';
import { Resume } from './entities/resumes.entity';

@Injectable()
export class ResumesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly resumesService: ResumesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.hasPolicy(context) === false) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthorizedRequest & { resolvedResume: Resume | undefined }>();
    const userId = request.user.sub;
    const resumeId = request.params.resumeId;

    if (resumeId === undefined) {
      return true;
    }

    const resume = await this.resumesService.findOneOrFail(Number(resumeId));

    if (resume.userId !== userId) {
      return false;
    }

    request.resolvedResume = resume;

    return true;
  }

  private hasPolicy(context: ExecutionContext) {
    const resumePolicy = this.reflector.get<ResumeAction | undefined>(
      'resumePolicy',
      context.getHandler(),
    );

    if (resumePolicy === undefined) {
      return false;
    }

    return true;
  }
}
