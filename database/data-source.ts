import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import DatabaseEnvironment from '../src/common/config/environments/db.environment';

config();

const configService = new ConfigService();

export default new DataSource({
  type: configService.get('DB_TYPE') as `${DatabaseEnvironment}`,
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/migrations/*.ts'],
});
