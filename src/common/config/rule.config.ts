import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import ApplicationEnvironment from './environments/app.environment';

export default class RuleConfig {
  @IsEnum(ApplicationEnvironment)
  @IsOptional()
  APP_ENV: string;

  @IsNumber()
  @IsOptional()
  APP_PORT: number;
}
