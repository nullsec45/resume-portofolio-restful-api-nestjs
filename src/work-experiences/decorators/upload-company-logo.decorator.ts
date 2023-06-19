import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerLocalStorage } from '../../common/multer/storages/local.storage';

export const UploadCompanyLogo = () =>
  applyDecorators(
    UseInterceptors(
      FileInterceptor('companyLogo', {
        storage: multerLocalStorage(
          './public/uploads/resumes/images/companies',
        ),
      }),
    ),
  );
