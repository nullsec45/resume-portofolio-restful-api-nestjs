import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as multer from 'multer';
import { DiskStorageOptions } from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { StorageDriver } from '../config/environments/storage.environment';
import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    if (this.configService.get<`${StorageDriver}`>('storage.driver') === 's3') {
      const s3 = new S3Client({});
      const bucket = this.configService.get<string>('storage.bucket') as string;

      return {
        storage: multerS3({
          s3,
          bucket,
          acl: 'public-read',
          contentType: multerS3.AUTO_CONTENT_TYPE,
          metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
          },
          key: this.filenameWithExtension,
        }),
      };
    }

    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './storages/');
        },
        filename: this.filenameWithExtension,
      }),
    };
  }

  private filenameWithExtension: DiskStorageOptions['filename'] = (
    req,
    file,
    cb,
  ) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  };
}
