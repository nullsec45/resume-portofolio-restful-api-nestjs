import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
  /**
   * The HTTP status code of the response.
   *
   * @example 200
   */
  statusCode: number;

  /**
   * The message accompanying the response, if any.
   *
   * @example "OK"
   */
  message: string | null;

  /**
   * The data being returned in the response.
   *
   * @example
    {
      "sub": 1,
      "iat": 1624096800,
      "exp": 1624097100
    }
   */
  @ApiProperty({ type: () => Object })
  data: T;
}
