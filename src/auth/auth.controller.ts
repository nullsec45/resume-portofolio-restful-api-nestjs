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
import { ApiAuth } from './docs/api-auth.doc';
import { ApiSignInAuth } from './docs/api-sign-in-auth.doc';
import { ApiRegisterAuth } from './docs/api-register-auth.doc';
import { ApiProfileAuth } from './docs/api-profile-auth.doc';

@ApiAuth()
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Sign in endpoint for user authentication.
   */
  @ApiSignInAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  /**
   * Register endpoint for creating a new user.
   */
  @ApiRegisterAuth()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Profile endpoint to get the authenticated user's profile.
   */
  @ApiProfileAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req: AuthorizedRequest) {
    return req.user;
  }
}
