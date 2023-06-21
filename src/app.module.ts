import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidation } from './common/config/config.validation';
import { ConfigRule } from './common/config/config.rule';
import { configValue } from './common/config/config.value';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from './common/typeorm/typeorm.service';
import { AuthModule } from './auth/auth.module';
import { ResumesModule } from './resumes/resumes.module';
import { WorkExperiencesModule } from './work-experiences/work-experiences.module';
import { StoragesModule } from './storages/storages.module';

@Module({})
export class AppModule {
  static register(envFilePath: string | string[] = '.env'): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath,
          load: configValue,
          validate: configValidation(ConfigRule),
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmService,
        }),
        StoragesModule,
        AuthModule,
        UsersModule,
        ResumesModule,
        WorkExperiencesModule,
      ],
    };
  }
}
