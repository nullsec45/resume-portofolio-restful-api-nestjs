import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const createSwaggerDocument = ({
  app,
  port,
}: {
  app: NestExpressApplication;
  port: number;
}) => {
  const config = new DocumentBuilder()
    .setTitle('Resume API')
    .setDescription('API for managing resumes')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Local server Resume API')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  };

  return SwaggerModule.createDocument(app, config, options);
};
