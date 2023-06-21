import { Module } from '@nestjs/common';
import { WorkExperiencesService } from './work-experiences.service';
import { WorkExperiencesController } from './work-experiences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkExperience } from './entities/work-experiences.entity';
import { ResumesModule } from '../resumes/resumes.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../common/multer/multer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkExperience]),
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    ResumesModule,
  ],
  controllers: [WorkExperiencesController],
  providers: [WorkExperiencesService],
})
export class WorkExperiencesModule {}
