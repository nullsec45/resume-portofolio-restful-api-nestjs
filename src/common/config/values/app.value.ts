import { registerAs } from '@nestjs/config';
import { ApplicationEnvironment } from '../environments/app.environment';

export const appValue = registerAs('app', () => ({
  env: process.env.APP_ENV || ApplicationEnvironment.Development,
  port: Number(process.env.APP_PORT) || 3000,
}));
