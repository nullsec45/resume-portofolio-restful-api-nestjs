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
  UploadedFiles,
} from '@nestjs/common';
import { WorkExperiencesService } from './work-experiences.service';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';
import { ResponseInterceptor } from '../common/response/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { ResumesGuard } from '../resumes/resumes.guard';
import { CheckResumePolicy } from '../resumes/decorators/check-resume-policy.decorator';
import { ResumeAction } from '../resumes/enums/resume-action.enum';
import { WorkExperiencesGuard } from './work-experiences.guard';
import { CheckWorkExperiencePolicy } from './decorators/check-work-experience-policy.decorator';
import { WorkExperienceAction } from './enums/work-experience-action.enum';
import { ResolvedWorkExperience } from './decorators/resolved-work-experience.decorator';
import { WorkExperience } from './entities/work-experiences.entity';
import { UploadCompanyLogo } from './decorators/upload-company-logo.decorator';
import { CreateWorkExperiencesDto } from './dto/create-work-experiences.dto';
import { NewWorkExperience } from './types/new-work-experience.type';
import { UploadCompanyLogos } from './decorators/upload-company-logos.decorator';
import { parseImage } from '../common/validators/pipes/parse-image.pipe';
import { ApiWorkExperience } from './docs/api-work-experience.doc';
import { ApiCreateWorkExperience } from './docs/api-create-work-experience.doc';
import { ApiCreateWorkExperiences } from './docs/api-create-work-experiences.doc';
import { ApiFindAllWorkExperiences } from './docs/api-find-all-work-experiences.dto';
import { ApiFindOneWorkExperience } from './docs/api-find-one-work-experience.dto';
import { ApiUpdateWorkExperience } from './docs/api-update-work-experience.dto';
import { ApiDeleteWorkExperience } from './docs/api-delete-work-experience.dto';

@ApiWorkExperience()
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller({ version: '1' })
@UseGuards(AuthGuard, ResumesGuard, WorkExperiencesGuard)
export class WorkExperiencesController {
  constructor(
    private readonly workExperiencesService: WorkExperiencesService,
  ) {}

  /**
   * Create a new work experience.
   */
  @ApiCreateWorkExperience()
  @HttpCode(HttpStatus.CREATED)
  @Post('resumes/:resumeId/work-experiences')
  @CheckResumePolicy(ResumeAction.Manage)
  @UploadCompanyLogo()
  create(
    @Param('resumeId') resumeId: number,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
    @UploadedFile(parseImage) file: Express.Multer.File | undefined,
  ) {
    return this.workExperiencesService.create({
      ...createWorkExperienceDto,
      resumeId,
      companyLogo: file?.path ?? null,
    });
  }

  /**
   * Create multiple work experiences in bulk.
   */
  @ApiCreateWorkExperiences()
  @HttpCode(HttpStatus.CREATED)
  @Post('resumes/:resumeId/work-experiences/bulk')
  @CheckResumePolicy(ResumeAction.Manage)
  @UploadCompanyLogos()
  creates(
    @Param('resumeId') resumeId: number,
    @Body() createWorkExperiencesDto: CreateWorkExperiencesDto,
    @UploadedFiles(parseImage) files: Array<Express.Multer.File> | undefined,
  ) {
    const workExperiences = createWorkExperiencesDto.jobTitle.map(
      (_, i): NewWorkExperience => ({
        jobTitle: createWorkExperiencesDto.jobTitle.at(i) as string,
        jobDescription: createWorkExperiencesDto.jobDescription?.at(i) ?? null,
        company: createWorkExperiencesDto.company?.at(i) ?? null,
        startDate: createWorkExperiencesDto.startDate.at(i) as Date,
        endDate: createWorkExperiencesDto.endDate?.at(i) ?? null,
        companyLogo: files?.at(i)?.path ?? null,
        resumeId,
      }),
    );

    return this.workExperiencesService.creates(workExperiences);
  }

  /**
   * Get all work experiences for a specific resume.
   */
  @ApiFindAllWorkExperiences()
  @HttpCode(HttpStatus.OK)
  @Get('resumes/:resumeId/work-experiences')
  @CheckResumePolicy(ResumeAction.Manage)
  findAll(@Param('resumeId') resumeId: number) {
    return this.workExperiencesService.findAllByResumeId(resumeId);
  }

  /**
   * Get a specific work experience by ID.
   */
  @ApiFindOneWorkExperience()
  @HttpCode(HttpStatus.OK)
  @Get('work-experiences/:workExperienceId')
  @CheckWorkExperiencePolicy(WorkExperienceAction.Manage)
  findOne(@ResolvedWorkExperience() workExperience: WorkExperience) {
    return workExperience;
  }

  /**
   * Update a work experience.
   */
  @ApiUpdateWorkExperience()
  @HttpCode(HttpStatus.OK)
  @Patch('work-experiences/:workExperienceId')
  @CheckWorkExperiencePolicy(WorkExperienceAction.Manage)
  @UploadCompanyLogo()
  update(
    @ResolvedWorkExperience() workExperience: WorkExperience,
    @Body() updateWorkExperienceDto: UpdateWorkExperienceDto,
    @UploadedFile(parseImage) file: Express.Multer.File | undefined,
  ) {
    return this.workExperiencesService.save(
      Object.assign(workExperience, {
        ...updateWorkExperienceDto,
        companyLogo: file?.path ?? null,
      }),
    );
  }

  /**
   * Delete a work experience by ID.
   */
  @ApiDeleteWorkExperience()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('work-experiences/:workExperienceId')
  @CheckWorkExperiencePolicy(WorkExperienceAction.Manage)
  remove(@Param('workExperienceId') workExperienceId: number) {
    return this.workExperiencesService.remove(workExperienceId);
  }
}
