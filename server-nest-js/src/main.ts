// Path alias setup, do NOT import anything above this
import * as path from 'path';
import * as moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@': path.resolve(__dirname)
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import KEYS from "@/keys";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(KEYS.PORT);
}
bootstrap();
