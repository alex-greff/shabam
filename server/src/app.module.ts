import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import KEYS from '@/keys';
import MikroOrmConfig from "@/mikro-orm.config";
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { DateScalar } from '@/common/scalars/date.scalar';

import { PoliciesModule } from '@/modules/policies/policies.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { CatalogModule } from '@/modules/catalog/catalog.module';
import { SearchModule } from '@/modules/search/search.module';
import { RecordsModule } from './modules/records/records.module';
import { ArtistModule } from './modules/artist/artist.module';
import { FingerprintModule } from './modules/fingerprint/fingerprint.module';


@Module({
  imports: [
    PoliciesModule,
    // --- Graphql Modules ---
    AuthModule,
    UserModule,
    ArtistModule,
    CatalogModule,
    SearchModule,
    FingerprintModule,
    RecordsModule,
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
    MikroOrmModule.forRoot(MikroOrmConfig)
  ],
  providers: [
    // --- Scalars ---
    DateScalar,
  ],
  exports: [PoliciesModule],
})
export class AppModule {}
