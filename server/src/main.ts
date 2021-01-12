// Path alias setup, do NOT import anything above this
import * as path from 'path';
import * as moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@': path.resolve(__dirname)
});

import { NestFactory } from '@nestjs/core';
import * as Config from "@/config";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import KEYS from "@/keys";

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // For express session to work properly behind the proxy
  app.set("trust proxy", 1);

  // Setup express session with Redis as the store
  const RedisStore = connectRedis(session);
  const redisSessionClient = redis.createClient({
    host: KEYS.REDIS_SESSION_HOST,
    port: KEYS.REDIS_SESSION_PORT,
    password: KEYS.REDIS_SESSION_PASSWORD,
  });
  app.use(
    session({
      store: new RedisStore({ client: redisSessionClient }),
      secret: KEYS.SESSION_SECRET,
      cookie: {
        sameSite: false,
        httpOnly: true,
        secure: KEYS.PRODUCTION ? true : false,
        expires: new Date(Date.now() + Config.SESSION_EXPIRE_LENGTH),
      },
      saveUninitialized: false,
      resave: true,
    })
  );

  await app.listen(KEYS.PORT);
  console.log("🚀 Running on port", KEYS.PORT);
}
bootstrap();
