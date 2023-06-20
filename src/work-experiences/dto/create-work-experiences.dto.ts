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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const now = new Date().toISOString().substring(0, 10);

export class CreateWorkExperiencesDto {
  /**
   * Array of job titles for the work experiences.
   *
   * @example ["Software Engineer", "Senior Software Engineer"]
   */
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiProperty({ type: Array<string> })
  jobTitle: string[];

  /**
   * Array of job descriptions for the work experiences.
   *
   * @example ["Developed web applications using React and Node.js."]
   */
  @IsOptional({ each: true })
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiPropertyOptional({ type: Array<string> })
  jobDescription: (string | null)[] | null;

  /**
   * Array of company names for the work experiences.
   *
   * @example ["Example Corporation"]
   */
  @IsOptional({ each: true })
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @ApiPropertyOptional({ type: Array<string> })
  company: (string | null)[] | null;

  /**
   * Logo of the company in the work experience.
   *
   * @example []
   */
  @IsOptional()
  @ApiPropertyOptional({ type: Array, format: 'binary' })
  companyLogo: any;

  /**
   * Array of start dates for the work experiences.
   *
   * @example ["2022-01-01", "2023-06-01"]
   */
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
  @ApiProperty({ type: Array<Date> })
  startDate: Date[];

  /**
   * Array of end dates for the work experiences.
   *
   * @example ["2023-06-01"]
   */
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
  @ApiPropertyOptional({ type: Array<Date> })
  endDate: (Date | null)[] | null;
}
