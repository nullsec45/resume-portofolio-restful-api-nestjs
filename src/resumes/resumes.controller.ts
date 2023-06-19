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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../common/response/dto/success-response.dto';
import { FailedResponseDto } from '../common/response/dto/failed-response.dto';
import { SuccessSchema } from '../common/response/constants/success-schema.constant';
import { FailedSchema } from '../common/response/constants/failed-schema.constant';

@ApiBearerAuth()
@ApiUnauthorizedResponse(
  FailedSchema(`JWT token couldn't be found`, HttpStatus.UNAUTHORIZED),
)
@ApiTags('resumes')
@ApiExtraModels(SuccessResponseDto, FailedResponseDto, Resume)
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller({ version: '1', path: 'resumes' })
@UseGuards(AuthGuard, ResumesGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /**
   * Create a new resume.
   */
  @ApiConsumes(
    'multipart/form-data',
    'application/x-www-form-urlencoded',
    'application/json',
  )
  @ApiCreatedResponse(SuccessSchema(Resume, HttpStatus.CREATED))
  @ApiBadRequestResponse(
    FailedSchema(['name must be a string'], HttpStatus.BAD_REQUEST),
  )
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
  @ApiOkResponse(SuccessSchema(Resume, HttpStatus.OK, true))
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Request() req: AuthorizedRequest) {
    return this.resumesService.findAllByUserId(req.user.sub);
  }

  /**
   * Get a specific resume by ID.
   */
  @ApiOkResponse(SuccessSchema(Resume, HttpStatus.OK, true))
  @ApiBadRequestResponse(
    FailedSchema(':resumeId should be a number', HttpStatus.BAD_REQUEST),
  )
  @ApiNotFoundResponse(
    FailedSchema('Resume with id 1 not found', HttpStatus.NOT_FOUND),
  )
  @ApiForbiddenResponse(
    FailedSchema('Forbidden resource', HttpStatus.FORBIDDEN),
  )
  @ApiParam({ name: 'resumeId', type: Number })
  @HttpCode(HttpStatus.OK)
  @Get(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  findOne(@ResolvedResume() resume: Resume) {
    return resume;
  }

  /**
   * Update a specific resume by ID.
   */
  @ApiConsumes(
    'multipart/form-data',
    'application/x-www-form-urlencoded',
    'application/json',
  )
  @ApiOkResponse(SuccessSchema(Resume, HttpStatus.OK))
  @ApiBadRequestResponse(
    FailedSchema(':resumeId should be a number', HttpStatus.BAD_REQUEST),
  )
  @ApiNotFoundResponse(
    FailedSchema('Resume with id 1 not found', HttpStatus.NOT_FOUND),
  )
  @ApiForbiddenResponse(
    FailedSchema('Forbidden resource', HttpStatus.FORBIDDEN),
  )
  @ApiParam({ name: 'resumeId', type: Number })
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
  @ApiBadRequestResponse(
    FailedSchema(':resumeId should be a number', HttpStatus.BAD_REQUEST),
  )
  @ApiNotFoundResponse(
    FailedSchema('Resume with id 1 not found', HttpStatus.NOT_FOUND),
  )
  @ApiForbiddenResponse(
    FailedSchema('Forbidden resource', HttpStatus.FORBIDDEN),
  )
  @ApiParam({ name: 'resumeId', type: Number })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':resumeId')
  @CheckResumePolicy(ResumeAction.Manage)
  remove(@Param('resumeId') resumeId: string) {
    return this.resumesService.remove(Number(resumeId));
  }
}
