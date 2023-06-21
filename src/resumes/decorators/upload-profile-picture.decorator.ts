import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const UploadProfilePicture = () =>
  applyDecorators(UseInterceptors(FileInterceptor('profilePicture')));
