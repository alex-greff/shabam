import { SearchEntity } from '@/entities/Search.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchResolver } from './search.resolvers';
import { SearchService } from './search.service';

@Global()
@Module({
  imports: [ 
    TypeOrmModule.forFeature([SearchEntity])
  ],
  providers: [
    SearchResolver, 
    SearchService
  ],
})
export class SearchModule {}