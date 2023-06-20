import { ValidationPipe } from '@nestjs/common';

export const globalValidation = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
});
