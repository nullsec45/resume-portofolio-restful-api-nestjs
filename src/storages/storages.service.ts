import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { StorageDriver } from '../common/config/environments/storage.environment';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { FileStream } from './interfaces/file-stream.interface';

@Injectable()
export class StoragesService {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3();
  }

  findOne(fileId: string) {
    if (this.configService.get<`${StorageDriver}`>('storage.driver') === 's3') {
      return this.findOneFromS3(fileId);
    }

    return this.findOneFromLocal(fileId);
  }

  private findOneFromLocal(fileId: string) {
    return new Promise<FileStream>((resolve, reject) => {
      const filePath = join(__dirname, '/../../', `storages/${fileId}`);
      const fileStats = fs.statSync(filePath, {
        throwIfNoEntry: false,
      });

      if (fileStats === undefined) {
        return reject({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'File not available',
        });
      }

      const contentType = mime.lookup(filePath) || 'application/octet-stream';
      const contentLength = String('asd');
      const fileStream = fs.createReadStream(filePath);

      return resolve({
        stream: fileStream,
        contentType,
        contentLength,
      });
    });
  }

  private findOneFromS3(fileId: string) {
    const options = {
      Bucket: this.configService.get<string>('storage.bucket') as string,
      Key: fileId,
    };

    return new Promise<FileStream>((resolve, reject) => {
      this.s3.headObject(options, (err, data) => {
        if (err) {
          return reject(err);
        }

        const stream = this.s3.getObject(options).createReadStream();

        return resolve({
          stream,
          contentType: String(data.ContentType),
          contentLength: String(data.ContentLength),
        });
      });
    });
  }
}
