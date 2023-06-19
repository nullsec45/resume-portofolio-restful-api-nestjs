import { ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/success-response.dto';
import { HttpStatus } from '@nestjs/common';
import { STATUS_CODES } from 'http';

export const SuccessSchema = (
  model: Parameters<typeof getSchemaPath>[0],
  statusCode: HttpStatus,
): ApiResponseOptions => ({
  schema: {
    allOf: [
      { $ref: getSchemaPath(SuccessResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(model) },
          statusCode: { example: statusCode },
          message: { example: STATUS_CODES[statusCode] },
        },
      },
    ],
  },
});
