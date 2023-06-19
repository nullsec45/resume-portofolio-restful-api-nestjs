import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const now = new Date().toISOString().substring(0, 10);

export class CreateWorkExperienceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  jobTitle: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  jobDescription: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  company: string | null;

  @IsNotEmpty()
  @IsDateString(
    {},
    {
      message: `startDate must be a valid ISO 8601 date string with the format YYYY-MM-DD like ${now}`,
    },
  )
  startDate: Date;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: `startDate must be a valid ISO 8601 date string with the format YYYY-MM-DD like ${now}`,
    },
  )
  endDate: Date | null;
}
