import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resume } from '../../resumes/entities/resumes.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class WorkExperience {
  /**
   * Unique identifier of the work experience.
   *
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID of the resume associated with the work experience.
   *
   * @example 1
   */
  @Column()
  resumeId: number;

  /**
   * Job title of the work experience.
   *
   * @example "Software Engineer"
   */
  @Column()
  jobTitle: string;

  /**
   * Description of the job in the work experience.
   *
   * @example "Developed web applications using React and Node.js."
   */
  @Column({ nullable: true, type: String })
  jobDescription: string | null;

  /**
   * Company name of the work experience.
   *
   * @example "Example Corporation"
   */
  @Column({ nullable: true, type: String })
  company: string | null;

  /**
   * Logo of the company in the work experience.
   *
   * @example "public/uploads/resumes/images/companies/92665c8da90f4dc344b878ed0970bdbd.jpeg"
   */
  @Column({ nullable: true, type: String })
  companyLogo: string | null;

  /**
   * Start date of the work experience.
   *
   * @example "2022-01-01"
   */
  @Column()
  startDate: Date;

  /**
   * End date of the work experience.
   *
   * @example "2023-06-01"
   */
  @Column({ nullable: true, type: Date })
  endDate: Date | null;

  /**
   * Date when the work experience was created.
   *
   * @example "2023-06-19T10:30:00.000Z"
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date when the work experience was last updated.
   *
   * @example "2023-06-19T14:45:00.000Z"
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Resume associated with the work experience.
   * This property is excluded from the response payload.
   */
  @ManyToOne(() => Resume, (resume) => resume.workExperiences, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  @ApiHideProperty()
  resume: Resume;
}
