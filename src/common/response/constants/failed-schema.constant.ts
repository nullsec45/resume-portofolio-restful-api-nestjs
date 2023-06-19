import { ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { FailedResponseDto } from '../dto/failed-response.dto';

export const FailedSchema = (
  message: string,
  statusCode: HttpStatus,
): ApiResponseOptions => ({
  schema: {
    allOf: [
      { $ref: getSchemaPath(FailedResponseDto) },
      {
        properties: {
          error: { example: STATUS_CODES[statusCode] },
          statusCode: { example: statusCode },
          message: { example: message },
        },
      },
    ],
  },
});
