import { Test } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

describe('AuthGuard', () => {
  let context: ExecutionContext;
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  const mockRequestHeadersAuthorization = (
    authorization: string | undefined,
  ) => {
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getRequest: () => ({ headers: { authorization } }),
      }),
    );
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthGuard],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return { verifyAsync: jest.fn() };
        }
      })
      .compile();

    context = new ExecutionContextHost([]);
    authGuard = module.get(AuthGuard);
    jwtService = module.get(JwtService);
  });

  it('should throw unauthorized exception if token is not provided', async () => {
    const authorization = undefined;
    mockRequestHeadersAuthorization(authorization);

    const callGuard = async () => await authGuard.canActivate(context);

    await expect(callGuard).rejects.toThrow(UnauthorizedException);
  });

  it('should throw unauthorized exception if provided token is not valid', async () => {
    const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    mockRequestHeadersAuthorization(authorization);
    jest.spyOn(jwtService, 'verifyAsync').mockImplementation(() => {
      throw new Error();
    });

    const callGuard = async () => await authGuard.canActivate(context);

    await expect(callGuard).rejects.toThrow(UnauthorizedException);
  });

  it('should pass guard if authentication is successful', async () => {
    const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    mockRequestHeadersAuthorization(authorization);
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockImplementation(() => Promise.resolve({}));

    const guard = await authGuard.canActivate(context);

    expect(guard).toBe(true);
  });
});
