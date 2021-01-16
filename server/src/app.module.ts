import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import KEYS from '@/keys';

import { DateScalar } from '@/common/scalars/date.scalar';
import { UploadScalar } from '@/common/scalars/upload.scalar';

import { PoliciesModule } from '@/modules/policies/policies.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { CatalogModule } from '@/modules/catalog/catalog.module';
import { RecipesModule } from '@/modules/recipes/recipes.module';

import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { TrackEntity } from '@/entities/Track.entity';
import { SearchEntity } from '@/entities/Search.entity';
import { ArtistEntity } from '@/entities/Artist.entity';
import { PoliciesAbilityFactory } from './modules/policies/factories/policies-ability.factory';
import { SearchResultEntity } from './entities/SearchResult.entity';

@Module({
  imports: [
    PoliciesModule,
    // --- Graphql Modules ---
    AuthModule,
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
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    // --- Metadata Database ---
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: KEYS.PG_METADATA_HOST,
      port: KEYS.PG_METADATA_PORT,
      username: KEYS.PG_METADATA_USER,
      password: KEYS.PG_METADATA_PASSWORD,
      database: KEYS.PG_METADATA_DATABASE,
      synchronize: !KEYS.PRODUCTION,
      entities: [
        UserAccountEntity,
        TrackEntity,
        SearchEntity,
        SearchResultEntity,
        ArtistEntity,
      ],
    }),
  ],
  providers: [
    // --- Scalars ---
    UploadScalar,
    DateScalar,
  ],
  exports: [PoliciesModule],
})
export class AppModule {}
