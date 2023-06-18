import * as multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

export const multerLocalStorage = (destination = './public/uploads/') =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      crypto.pseudoRandomBytes(16, (err, raw) => {
        cb(null, raw.toString('hex') + path.extname(file.originalname));
      });
    },
  });
