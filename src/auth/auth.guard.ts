import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtUserPayloadDto } from './dto/jwt-user-payload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtUserPayloadDto }>();

    const token = this.extractTokenFromHeader(request);

    if (token === undefined) {
      throw new UnauthorizedException(`JWT token couldn't be found`);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtUserPayloadDto>(
        token,
      );

      request.user = payload;
    } catch {
      throw new UnauthorizedException(`Invalid JWT token`);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
