import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import KEYS from "@/keys";

import { CatsModule } from '@/modules/cats/cats.module';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot({
      debug: !KEYS.PRODUCTION,
      playground: !KEYS.PRODUCTION,
      typePaths: ["./**/*.graphql"]
    })
  ]
})
export class AppModule {}
