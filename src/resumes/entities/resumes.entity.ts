import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { WorkExperience } from '../../work-experiences/entities/work-experiences.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

/**
 * Entity representing a resume.
 */
@Entity()
export class Resume {
  /**
   * The unique identifier of the resume.
   *
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The ID of the user associated with the resume.
   *
   * @example 1
   */
  @Column()
  userId: number;

  /**
   * The name of the resume.
   *
   * @example "John Doe"
   */
  @Column()
  name: string;

  /**
   * The age of the person associated with the resume.
   *
   * @example 25
   */
  @Column()
  age: number;

  /**
   * The URL path to the profile picture of the resume.
   * It can be null if no profile picture is available.
   *
   * @example "storages/89bf78656bfed2c546375178826f23df.png"
   */
  @Column({ nullable: true, type: String })
  profilePicture: string | null;

  /**
   * The date and time when the resume was created.
   *
   * @example 2023-06-19T12:34:56.789Z
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the resume was last updated.
   *
   * @example 2023-06-19T12:34:56.789Z
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * The user associated with the resume.
   * This property is excluded from serialization.
   */
  @ManyToOne(() => User, (user) => user.resumes, {
    onDelete: 'CASCADE',
  })
  @Exclude()
  @ApiHideProperty()
  user: User;

  /**
   * The work experiences associated with the resume.
   * This property is excluded from serialization.
   */
  @OneToMany(() => WorkExperience, (workExperience) => workExperience.resume, {
    cascade: true,
  })
  @Exclude()
  @ApiHideProperty()
  workExperiences: WorkExperience[];
}
