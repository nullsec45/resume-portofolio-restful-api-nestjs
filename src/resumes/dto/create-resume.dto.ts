import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateResumeDto {
  /**
   * The name of the resume.
   *
   * @example "John Doe"
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The age of the person associated with the resume.
   *
   * @example 25
   */
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  age: number;

  /**
   * The profile picture file for the resume.
   */
  @IsOptional()
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  profilePicture: any;
}
