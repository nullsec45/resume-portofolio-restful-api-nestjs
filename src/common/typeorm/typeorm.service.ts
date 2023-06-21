import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseEnvironment } from '../config/environments/db.environment';
import { ApplicationEnvironment } from '../config/environments/app.environment';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const appEnv =
      this.configService.get<`${ApplicationEnvironment}`>('app.env');

    return {
      type: this.configService.get<`${DatabaseEnvironment}`>('db.type'),
      host: this.configService.get<string>('db.host'),
      port: this.configService.get<number>('db.port'),
      username: this.configService.get<string>('db.username'),
      password: this.configService.get<string>('db.password'),
      database: this.configService.get<string>('db.database'),
      autoLoadEntities: true,
      ssl: {
        rejectUnauthorized: this.configService.get<boolean>('db.ssl'),
      },
      synchronize:
        appEnv === 'development' || appEnv === 'testing' ? true : false,
      logging: appEnv === 'development' ? true : false,
    };
  }
}
