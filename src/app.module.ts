import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './common/config/validate.config';
import RuleConfig from './common/config/rule.config';
import { valueConfig } from './common/config/value.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from './common/typeorm/typeorm.service';

@Module({})
export class AppModule {
  static register(envFilePath: string | string[] = '.env'): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath,
          load: valueConfig,
          validate: validateConfig(RuleConfig),
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmService,
        }),
      ],
    };
  }
}
