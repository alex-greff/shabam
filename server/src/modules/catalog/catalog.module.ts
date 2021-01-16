import { TrackEntity } from '@/entities/Track.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogResolver } from './catalog.resolvers';
import { CatalogService } from './catalog.service';

@Global()
@Module({
  imports: [ 
    TypeOrmModule.forFeature([TrackEntity])
  ],
  providers: [
    CatalogResolver, 
    CatalogService
  ],
})
export class CatalogModule {}
