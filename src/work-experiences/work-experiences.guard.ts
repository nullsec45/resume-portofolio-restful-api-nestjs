import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizedRequest } from '../auth/interfaces/authorized-request.interface';
import { WorkExperiencesService } from './work-experiences.service';
import { WorkExperience } from './entities/work-experiences.entity';
import { WorkExperienceAction } from './enums/work-experience-action.enum';

@Injectable()
export class WorkExperiencesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly workExperiencesService: WorkExperiencesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.hasPolicy(context) === false) {
      return true;
    }

    const request = context.switchToHttp().getRequest<
      AuthorizedRequest & {
        resolvedWorkExperience: WorkExperience | undefined;
      }
    >();
    const userId = request.user.sub;
    const workExperienceId = request.params.workExperienceId;

    if (workExperienceId === undefined) {
      return true;
    }

    const workExperience = await this.workExperiencesService.findOneOrFail(
      Number(workExperienceId),
    );

    if (workExperience.resume.userId !== userId) {
      return false;
    }

    request.resolvedWorkExperience = workExperience;

    return true;
  }

  private hasPolicy(context: ExecutionContext) {
    const workExperiencePolicy = this.reflector.get<
      WorkExperienceAction | undefined
    >('workExperiencePolicy', context.getHandler());

    if (workExperiencePolicy === undefined) {
      return false;
    }

    return true;
  }
}
