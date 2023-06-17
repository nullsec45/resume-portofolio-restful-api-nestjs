import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

const fileValidators = [
  new MaxFileSizeValidator({ maxSize: 512000 }),
  new FileTypeValidator({ fileType: 'image' }),
];

export default fileValidators;
