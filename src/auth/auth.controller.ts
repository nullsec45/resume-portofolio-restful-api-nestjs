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
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../common/response/dto/success-response.dto';
import { User } from '../users/entities/users.entity';
import { SuccessSchema } from '../common/response/constants/success-schema.constant';
import { SuccessfulSignInDto } from './dto/successful-sign-in.dto';
import { JwtUserPayloadDto } from './dto/jwt-user-payload.dto';

@ApiTags('auth')
@ApiExtraModels(
  SuccessResponseDto,
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
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  /**
   * Register endpoint for creating a new user.
   */
  @ApiCreatedResponse(SuccessSchema(User, HttpStatus.CREATED))
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Profile endpoint to get the authenticated user's profile.
   */
  @ApiOkResponse(SuccessSchema(JwtUserPayloadDto, HttpStatus.OK))
  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req: AuthorizedRequest) {
    return req.user;
  }
}
