import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ArrayLengthMatch } from '../../common/validators/decorators/array-length-match.decorator';

const now = new Date().toISOString().substring(0, 10);

export class CreateWorkExperiencesDto {
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  jobTitle: string[];

  @IsOptional({ each: true })
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  jobDescription: (string | null)[] | null;

  @IsOptional({ each: true })
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  company: (string | null)[] | null;

  @IsNotEmpty({ each: true })
  @ArrayLengthMatch('jobTitle')
  @IsDateString(
    {},
    {
      each: true,
      message: `startDate must be a valid ISO 8601 date string with the format YYYY-MM-DD like ${now}`,
    },
  )
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  startDate: Date[];

  @IsOptional()
  @IsDateString(
    {},
    {
      each: true,
      message: `startDate must be a valid ISO 8601 date string with the format YYYY-MM-DD like ${now}`,
    },
  )
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  endDate: (Date | null)[] | null;
}
