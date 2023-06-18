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

@Entity()
export class WorkExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resumeId: number;

  @Column()
  jobTitle: string;

  @Column({ nullable: true, type: String })
  jobDescription: string | null;

  @Column({ nullable: true, type: String })
  company: string | null;

  @Column({ nullable: true, type: String })
  companyLogo: string | null;

  @Column()
  startDate: Date;

  @Column({ nullable: true, type: Date })
  endDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @ManyToOne(() => Resume, (resume) => resume.workExperiences, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  resume: Resume;
}
