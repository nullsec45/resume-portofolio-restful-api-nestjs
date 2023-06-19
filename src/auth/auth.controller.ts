import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthorizedRequest } from './interfaces/authorized-request.interface';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseInterceptor } from '../common/response/response.interceptor';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../common/response/dto/success-response.dto';
import { User } from '../users/entities/users.entity';
import { SuccessSchema } from '../common/response/constants/success-schema.constant';
import { SuccessfulSignInDto } from './dto/successful-sign-in.dto';
import { JwtUserPayloadDto } from './dto/jwt-user-payload.dto';
import { FailedSchema } from '../common/response/constants/failed-schema.constant';
import { FailedResponseDto } from '../common/response/dto/failed-response.dto';

@ApiTags('auth')
@ApiExtraModels(
  SuccessResponseDto,
  FailedResponseDto,
  SuccessfulSignInDto,
  JwtUserPayloadDto,
  User,
)
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Sign in endpoint for user authentication.
   */
  @ApiOkResponse(SuccessSchema(SuccessfulSignInDto, HttpStatus.OK))
  @ApiUnauthorizedResponse(
    FailedSchema('Invalid username or password', HttpStatus.UNAUTHORIZED),
  )
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  /**
   * Register endpoint for creating a new user.
   */
  @ApiCreatedResponse(SuccessSchema(User, HttpStatus.CREATED))
  @ApiBadRequestResponse(
    FailedSchema(
      'password and confirmPassword does not match',
      HttpStatus.BAD_REQUEST,
    ),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Profile endpoint to get the authenticated user's profile.
   */
  @ApiBearerAuth()
  @ApiOkResponse(SuccessSchema(JwtUserPayloadDto, HttpStatus.OK))
  @ApiUnauthorizedResponse(
    FailedSchema(`JWT token couldn't be found`, HttpStatus.UNAUTHORIZED),
  )
  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req: AuthorizedRequest) {
    return req.user;
  }
}
