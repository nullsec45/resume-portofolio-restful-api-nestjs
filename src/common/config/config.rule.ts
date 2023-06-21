import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApplicationEnvironment } from './environments/app.environment';
import {
  DatabaseEnvironment,
  DatabaseSsl,
} from './environments/db.environment';
import { StorageDriver } from './environments/storage.environment';

export class ConfigRule {
  @IsEnum(ApplicationEnvironment)
  @IsOptional()
  APP_ENV: string;

  @IsNumber()
  @IsOptional()
  APP_PORT: number;

  @IsNotEmpty()
  @IsEnum(DatabaseEnvironment)
  DB_TYPE: string;

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DB_DATABASE: string;

  @IsOptional()
  @IsEnum(DatabaseSsl)
  DB_SSL: string;

  @IsOptional()
  @IsEnum(StorageDriver)
  STORAGE_DRIVER: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((rule: ConfigRule) => rule.STORAGE_DRIVER === 's3')
  STORAGE_BUCKET: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET_KEY: string;

  @IsOptional()
  @IsNumber()
  JWT_TOKEN_TTL_IN_SECONDS: number;
}
