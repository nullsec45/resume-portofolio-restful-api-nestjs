import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerLocalStorage } from '../../common/multer/storages/local.storage';

export const UploadCompanyLogos = () =>
  applyDecorators(
    UseInterceptors(
      FilesInterceptor('companyLogo', undefined, {
        storage: multerLocalStorage(
          './public/uploads/resumes/images/companies',
        ),
      }),
    ),
  );
