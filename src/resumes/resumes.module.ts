import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resume } from './entities/resumes.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../common/multer/multer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume]),
    MulterModule.registerAsync({ useClass: MulterConfigService }),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
