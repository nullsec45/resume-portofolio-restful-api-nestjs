import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { WorkExperiencesService } from './work-experiences.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';
import { ResponseInterceptor } from '../common/response/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { ResumesGuard } from '../resumes/resumes.guard';
import { CheckResumePolicy } from '../resumes/decorators/check-resume-policy.decorator';
import ResumeAction from '../resumes/enums/resume-action.enum';
import { WorkExperiencesGuard } from './work-experiences.guard';
import { CheckWorkExperiencePolicy } from './decorators/check-work-experience-policy.decorator';
import WorkExperienceAction from './enums/work-experience-action.enum';
import { ResolvedWorkExperience } from './decorators/resolved-work-experience.decorator';
import { WorkExperience } from './entities/work-experiences.entity';
import fileValidators from '../common/constants/file-validators.constant';
import { UploadCompanyLogo } from './decorators/upload-company-logo.decorator';

@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller({ version: '1' })
@UseGuards(AuthGuard, ResumesGuard, WorkExperiencesGuard)
export class WorkExperiencesController {
  constructor(
    private readonly workExperiencesService: WorkExperiencesService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('resumes/:resumeId/work-experiences')
  @CheckResumePolicy(ResumeAction.Manage)
  @UploadCompanyLogo()
  create(
    @Param('resumeId') resumeId: string,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: fileValidators,
      }),
    )
    file: Express.Multer.File | undefined,
  ) {
    return this.workExperiencesService.create({
      ...createWorkExperienceDto,
      resumeId: Number(resumeId),
      companyLogo: file?.path ?? null,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('resumes/:resumeId/work-experiences')
  @CheckResumePolicy(ResumeAction.Manage)
  findAll(@Param('resumeId') resumeId: string) {
    return this.workExperiencesService.findAllByResumeId(Number(resumeId));
  }

  @HttpCode(HttpStatus.OK)
  @Get('work-experiences/:workExperienceId')
  @CheckWorkExperiencePolicy(WorkExperienceAction.Manage)
  findOne(@ResolvedWorkExperience() workExperience: WorkExperience) {
    return workExperience;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('work-experiences/:workExperienceId')
  @CheckWorkExperiencePolicy(WorkExperienceAction.Manage)
  @UploadCompanyLogo()
  update(
    @ResolvedWorkExperience() workExperience: WorkExperience,
    @Body() updateWorkExperienceDto: UpdateWorkExperienceDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: fileValidators,
      }),
    )
    file: Express.Multer.File | undefined,
  ) {
    return this.workExperiencesService.save(
      Object.assign(workExperience, {
        ...updateWorkExperienceDto,
        companyLogo: file?.path ?? null,
      }),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('work-experiences/:workExperienceId')
  @CheckWorkExperiencePolicy(WorkExperienceAction.Manage)
  remove(@Param('workExperienceId') workExperienceId: string) {
    return this.workExperiencesService.remove(Number(workExperienceId));
  }
}
