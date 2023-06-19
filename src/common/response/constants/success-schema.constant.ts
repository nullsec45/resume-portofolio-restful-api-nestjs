import { ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dto/success-response.dto';
import { HttpStatus } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ReferenceObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

type Model = Parameters<typeof getSchemaPath>[0];

const schemaData = (
  model: Model,
  isArray: boolean,
): SchemaObject | ReferenceObject => {
  if (typeof model === 'string') {
    return {};
  }

  const $ref = getSchemaPath(model);

  if (isArray === true) {
    return { type: 'array', items: { $ref } };
  }

  return { $ref };
};

export const SuccessSchema = (
  model: Model,
  statusCode: HttpStatus,
  isArray = false,
): ApiResponseOptions => ({
  schema: {
    allOf: [
      { $ref: getSchemaPath(SuccessResponseDto<Model>) },
      {
        properties: {
          data: schemaData(model, isArray),
          statusCode: { example: statusCode },
          message: { example: STATUS_CODES[statusCode] },
        },
      },
    ],
  },
});
