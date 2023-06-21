import { registerAs } from '@nestjs/config';

export const storageValue = registerAs('storage', () => ({
  driver: process.env.STORAGE_DRIVER || 'local',
  bucket: process.env.STORAGE_BUCKET,
}));
