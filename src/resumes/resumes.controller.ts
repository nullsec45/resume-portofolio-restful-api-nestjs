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
  ParseFilePipe,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseInterceptor } from '../common/response/response.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { AuthorizedRequest } from '../auth/interface/authorized-request.interface';
import { ResumesGuard } from './resumes.guard';
import ResumeAction from './enums/resume-action.enum';
import { CheckResumePolicy } from './decorators/check-resume-policy.decorator';
import { ResolvedResume } from './decorators/resolved-resume.decorator';
import { Resume } from './entities/resumes.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import fileValidators from './constants/file-validators.constant';

@UseInterceptors(ResponseInterceptor)
@Controller({ version: '1', path: 'resumes' })
@UseGuards(AuthGuard, ResumesGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseInterceptors(FileInterceptor('profilePicture'))
  create(
    @Request() req: AuthorizedRequest,
    @Body() createResumeDto: CreateResumeDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: fileValidators,
      }),
    )
    file: Express.Multer.File | undefined,
  ) {
    return this.resumesService.create({
      ...createResumeDto,
      userId: req.user.sub,
      profilePicture: file?.path ?? null,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Request() req: AuthorizedRequest) {
    return this.resumesService.findAllByUserId(req.user.sub);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  findOne(@ResolvedResume() resume: Resume) {
    return resume;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  update(
    @ResolvedResume() resume: Resume,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumesService.save({
      ...resume,
      ...updateResumeDto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  remove(@Param('resumeId') resumeId: string) {
    return this.resumesService.remove(Number(resumeId));
  }
}
