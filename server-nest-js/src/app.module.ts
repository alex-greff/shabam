import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import KEYS from "@/keys";

import { DateScalar } from "@/common/scalars/date.scalar";
import { UploadScalar } from "@/common/scalars/upload.scalar";

import { UserModule } from "@/modules/user/user.module";
import { CatalogModule } from "@/modules/catalog/catalog.module";
import { RecipesModule } from '@/modules/recipes/recipes.module';

@Module({
  imports: [
    // --- Modules ---
    UserModule,
    CatalogModule,
    RecipesModule, // TODO: remove
    // --- Root ---
    GraphQLModule.forRoot({
      debug: !KEYS.PRODUCTION,
      playground: !KEYS.PRODUCTION,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'src/schema.gql',
      uploads: {
        maxFileSize: 10000000, // 10 MB
        maxFiles: 10,
      }
    })
  ],
  providers: [
    // --- Scalars ---
    UploadScalar,
    DateScalar
  ]
})
export class AppModule {}
