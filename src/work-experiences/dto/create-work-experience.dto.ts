import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const now = new Date().toISOString().substring(0, 10);

export class CreateWorkExperienceDto {
  /**
   * Job title of the work experience.
   *
   * @example "Software Engineer"
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  jobTitle: string;

  /**
   * Description of the job in the work experience.
   *
   * @example "Developed web applications using React and Node.js."
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional()
  jobDescription: string | null;

  /**
   * Company name of the work experience.
   *
   * @example "Example Corporation"
   */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional()
  company: string | null;

  /**
   * Logo of the company in the work experience.
   */
  @IsOptional()
  @ApiPropertyOptional({ type: String, format: 'binary' })
  companyLogo: any;

  /**
   * Start date of the work experience.
   *
   * @example "2022-01-01"
   */
  @IsNotEmpty()
  @IsDateString(
    {},
    {
      message: `startDate must be a valid ISO 8601 date string with the format YYYY-MM-DD like ${now}`,
    },
  )
  startDate: Date;

  /**
   * End date of the work experience.
   *
   * @example "2023-06-01"
   */
  @IsOptional()
  @IsDateString(
    {},
    {
      message: `startDate must be a valid ISO 8601 date string with the format YYYY-MM-DD like ${now}`,
    },
  )
  @ApiPropertyOptional()
  endDate: Date | null;
}
