import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { StoragesService } from './storages.service';
import { STATUS_CODES } from 'http';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { FailedSchema } from '../common/response/constants/failed-schema.constant';
import { FailedResponseDto } from '../common/response/dto/failed-response.dto';

@ApiTags('storages')
@Controller({ path: 'storages' })
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  /**
   * Retrieves and streams a file with the specified fileId.
   */
  @ApiNotFoundResponse(FailedSchema('File not available', HttpStatus.NOT_FOUND))
  @Get(':fileId')
  async findOne(@Param('fileId') fileId: string, @Res() res: Response) {
    try {
      const { stream, contentType, contentLength } =
        await this.storagesService.findOne(fileId);

      res.status(HttpStatus.OK);
      res.set('Content-Type', contentType);
      res.set('Content-Length', contentLength);

      stream.pipe(res);
    } catch (e) {
      const statusCode = e?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(statusCode);
      return res.send({
        statusCode: statusCode,
        message:
          e?.message ??
          'An unknown error occurred while trying to access the file',
        error: STATUS_CODES[statusCode],
      } as FailedResponseDto);
    }
  }
}
