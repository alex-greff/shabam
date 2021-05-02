import { SearchEntity } from '@/entities/Search.entity';
import { SearchResultEntity } from '@/entities/SearchResult.entity';
import { TrackEntity } from '@/entities/Track.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { CatalogResolver } from './catalog.resolvers';
import { CatalogService } from './catalog.service';

@Global()
@Module({
  imports: [
    MikroOrmModule.forFeature([TrackEntity, SearchEntity, SearchResultEntity]),
  ],
  providers: [CatalogResolver, CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
