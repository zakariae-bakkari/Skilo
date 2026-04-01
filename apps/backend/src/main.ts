import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  app.enableCors({
    origin: 'http://localhost:5173', // URL de ton frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(port);
  console.log('server running on : http://localhost:' + port);
}
bootstrap();
