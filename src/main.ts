import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument } from './common/swagger/swagger.create-document';
import { globalValidation } from './common/validators/pipes/global-validation.pipe';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(),
    {
      cors: true,
    },
  );
  const configService = app.get(ConfigService);
  const port = configService.get('app.port') as number;

  app.use(helmet());
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(globalValidation);

  SwaggerModule.setup('docs', app, createSwaggerDocument({ app, port }));

  await app.listen(port);
};

bootstrap();
