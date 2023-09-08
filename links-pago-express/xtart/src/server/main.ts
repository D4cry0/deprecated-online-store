import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(' ');
  console.log(' ///-- Listen in http://localhost:3000/ --///')
  console.log(' ');
  await app.listen(3000);
}
bootstrap();
