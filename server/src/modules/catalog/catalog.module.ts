import { TrackEntity } from '@/entities/Track.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { CatalogResolver } from './catalog.resolvers';
import { CatalogService } from './catalog.service';

@Global()
@Module({
  imports: [ 
    MikroOrmModule.forFeature([TrackEntity])
  ],
  providers: [
    CatalogResolver, 
    CatalogService
  ],
})
export class CatalogModule {}
