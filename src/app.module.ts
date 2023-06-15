import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from './common/config/validate.config';
import RuleConfig from './common/config/rule.config';
import { valueConfig } from './common/config/value.config';

@Module({})
export class AppModule {
  static register(envFilePath: string | string[] = '.env'): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath,
          isGlobal: true,
          load: valueConfig,
          validate: validateConfig(RuleConfig),
        }),
      ],
    };
  }
}
