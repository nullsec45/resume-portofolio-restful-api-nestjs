import { CallHandler, ExecutionContext, HttpStatus } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Test } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { SuccessResponseDto } from './dto/success-response.dto';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let context: ExecutionContext;
  let responseInterceptor: ResponseInterceptor;

  const mockResponseStatusCode = (statusCode: HttpStatus) => {
    jest.spyOn(context, 'switchToHttp').mockImplementation(
      jest.fn().mockReturnValue({
        getResponse: () => ({ statusCode }),
      }),
    );
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    context = new ExecutionContextHost([]);
    responseInterceptor = module.get(ResponseInterceptor);

    mockResponseStatusCode(HttpStatus.OK);
  });

  it('should be able to wrap response data with success response structure', async () => {
    const data = { message: 'Hello World!' };
    const next: CallHandler = { handle: () => of(data) };

    const response = await firstValueFrom(
      responseInterceptor.intercept(context, next),
    );

    expect(response).toMatchObject(new SuccessResponseDto());
    expect(response).toEqual(
      expect.objectContaining<SuccessResponseDto>({
        data,
        message: expect.any(String),
        statusCode: expect.any(Number),
      }),
    );
  });

  it('should be able to have correct status code', async () => {
    const data = { message: 'Hello World!' };
    const next: CallHandler = { handle: () => of(data) };
    const statusCode = HttpStatus.CREATED;
    mockResponseStatusCode(statusCode);

    const response = await firstValueFrom(
      responseInterceptor.intercept(context, next),
    );

    expect(response.statusCode).toBe(statusCode);
  });
});
