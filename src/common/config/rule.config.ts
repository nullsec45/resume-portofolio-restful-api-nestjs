import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import ApplicationEnvironment from './environments/app.environment';
import DatabaseEnvironment from './environments/db.environment';

export default class RuleConfig {
  @IsEnum(ApplicationEnvironment)
  @IsOptional()
  APP_ENV: string;

  @IsNumber()
  @IsOptional()
  APP_PORT: number;

  @IsEnum(DatabaseEnvironment)
  DB_TYPE: string;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;
}
