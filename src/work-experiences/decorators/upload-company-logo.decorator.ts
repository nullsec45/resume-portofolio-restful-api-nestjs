import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const UploadCompanyLogo = () =>
  applyDecorators(UseInterceptors(FileInterceptor('companyLogo')));
