import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as multer from 'multer';
import { DiskStorageOptions } from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './public/uploads/');
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
