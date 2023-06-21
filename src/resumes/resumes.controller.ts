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
  Request,
  UploadedFile,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseInterceptor } from '../common/response/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { AuthorizedRequest } from '../auth/interfaces/authorized-request.interface';
import { ResumesGuard } from './resumes.guard';
import { ResumeAction } from './enums/resume-action.enum';
import { CheckResumePolicy } from './decorators/check-resume-policy.decorator';
import { ResolvedResume } from './decorators/resolved-resume.decorator';
import { Resume } from './entities/resumes.entity';
import { UploadProfilePicture } from './decorators/upload-profile-picture.decorator';
import { parseImage } from '../common/validators/pipes/parse-image.pipe';
import { ApiCreateResume } from './docs/api-create-resume.doc';
import { ApiFindAllResumes } from './docs/api-find-all-resumes.doc';
import { ApiFindOneResume } from './docs/api-find-one-resume.doc';
import { ApiUpdateResume } from './docs/api-update-resume.doc';
import { ApiDeleteResume } from './docs/api-delete-resume.doc';
import { ApiResume } from './docs/api-resume.doc';

@ApiResume()
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller({ version: '1', path: 'resumes' })
@UseGuards(AuthGuard, ResumesGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /**
   * Create a new resume.
   */
  @ApiCreateResume()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UploadProfilePicture()
  create(
    @Request() req: AuthorizedRequest,
    @Body() createResumeDto: CreateResumeDto,
    @UploadedFile(parseImage) file: Express.Multer.File | undefined,
  ) {
    return this.resumesService.create({
      ...createResumeDto,
      userId: req.user.sub,
      profilePicture: file?.path ?? null,
    });
  }

  /**
   * Get all resumes for the authenticated user.
   */
  @ApiFindAllResumes()
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Request() req: AuthorizedRequest) {
    return this.resumesService.findAllByUserId(req.user.sub);
  }

  /**
   * Get a specific resume by ID.
   */
  @ApiFindOneResume()
  @HttpCode(HttpStatus.OK)
  @Get(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  findOne(@ResolvedResume() resume: Resume) {
    return resume;
  }

  /**
   * Update a specific resume by ID.
   */
  @ApiUpdateResume()
  @HttpCode(HttpStatus.OK)
  @Patch(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  @UploadProfilePicture()
  update(
    @ResolvedResume() resume: Resume,
    @Body() updateResumeDto: UpdateResumeDto,
    @UploadedFile(parseImage) file: Express.Multer.File | undefined,
  ) {
    return this.resumesService.save(
      Object.assign(resume, {
        ...updateResumeDto,
        profilePicture: file?.path ?? null,
      }),
    );
  }

  /**
   * Delete a specific resume by ID.
   */
  @ApiDeleteResume()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  remove(@Param('resumeId') resumeId: number) {
    return this.resumesService.remove(resumeId);
  }
}
