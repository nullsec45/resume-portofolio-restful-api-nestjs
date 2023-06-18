import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerLocalStorage } from '../../common/multer/storages/local.storage';

export function UploadProfilePicture() {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('profilePicture', {
        storage: multerLocalStorage('./public/uploads/resumes/images/profiles'),
      }),
    ),
  );
}
