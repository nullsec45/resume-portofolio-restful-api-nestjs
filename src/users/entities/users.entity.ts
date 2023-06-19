import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Resume } from '../../resumes/entities/resumes.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class User {
  /**
   * User ID.
   *
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Unique username for the user.
   *
   * @example "johndoe123"
   */
  @Index({ unique: true })
  @Column()
  username: string;

  /**
   * User's password (encrypted or hashed).
   *
   * @example "12345678"
   */
  @Column()
  @Exclude()
  password: string;

  /**
   * Date and time when the user was created.
   *
   * @example "2023-06-19T12:30:00Z"
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date and time when the user was last updated.
   *
   * @example "2023-06-19T15:45:00Z"
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * List of resumes associated with the user.
   */
  @OneToMany(() => Resume, (resume) => resume.user)
  @Exclude()
  @ApiHideProperty()
  resumes: Resume[];
}
