import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import KEYS from "@/keys";

import { DateScalar } from "@/common/scalars/date.scalar";
import { UploadScalar } from "@/common/scalars/upload.scalar";

import { UserModule } from "@/modules/user/user.module";
import { CatalogModule } from "@/modules/catalog/catalog.module";
import { RecipesModule } from '@/modules/recipes/recipes.module';

import { UserAccount } from "@/entities/UserAccount.entity";
import { Track } from "@/entities/Track.entity";
import { Search } from "@/entities/Search.entity";
import { Artist } from "@/entities/Artist.entity";

@Module({
  imports: [
    // --- Modules ---
    UserModule,
    CatalogModule,
    RecipesModule, // TODO: remove
    // --- GraphQL ---
    GraphQLModule.forRoot({
      debug: !KEYS.PRODUCTION,
      playground: !KEYS.PRODUCTION,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'src/schema.gql',
      uploads: {
        maxFileSize: 10000000, // 10 MB
        maxFiles: 10,
      }
    }),
    // --- Metadata Database ---
    TypeOrmModule.forRoot({
      type: "postgres",
      host: KEYS.PG_METADATA_HOST,
      port: KEYS.PG_METADATA_PORT,
      username: KEYS.PG_METADATA_USER,
      password: KEYS.PG_METADATA_PASSWORD,
      database: KEYS.PG_METADATA_DATABASE,
      synchronize: !KEYS.PRODUCTION,
      entities: [UserAccount, Track, Search, Artist]
    })
  ],
  providers: [
    // --- Scalars ---
    UploadScalar,
    DateScalar
  ]
})
export class AppModule {}
