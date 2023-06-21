import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

export const UploadCompanyLogos = () =>
  applyDecorators(UseInterceptors(FilesInterceptor('companyLogo')));
