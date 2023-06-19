import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  statusCode: number;

  /**
   * @example "success" | "created"
   */
  message: string | null;

  @ApiProperty({ type: () => Array<T> })
  data: T;
}
