import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import KEYS from "@/keys";
import { join } from "path";

import { DateScalar } from "@/common/scalars/date.scalar";
import { UploadScalar } from "@/common/scalars/upload.scalar";

import { CatalogModule } from "@/modules/catalog/catalog.module";
import { RecipesModule } from '@/modules/recipes/recipes.module';

@Module({
  imports: [
    // // --- Scalars ---
    // DateScalar,
    // UploadScalar,
    // --- Modules ---
    CatalogModule,
    RecipesModule, // TODO: remove
    // --- Root ---
    GraphQLModule.forRoot({
      debug: !KEYS.PRODUCTION,
      playground: !KEYS.PRODUCTION,
      installSubscriptionHandlers: true,
      // typePaths: ["./**/*.graphql"], // TODO: remove
      autoSchemaFile: 'src/schema.gql',
      // uploads: {
      //   maxFileSize: 10000000, // 10 MB
      //   maxFiles: 10,
      // }
    })
  ],
  providers: [
    UploadScalar,
    DateScalar
  ]
})
export class AppModule {}
