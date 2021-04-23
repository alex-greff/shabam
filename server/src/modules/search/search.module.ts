import { SearchEntity } from '@/entities/Search.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { SearchResolver } from './search.resolvers';
import { SearchService } from './search.service';

@Global()
@Module({
  imports: [ 
    MikroOrmModule.forFeature([SearchEntity])
  ],
  providers: [
    SearchResolver, 
    SearchService
  ],
})
export class SearchModule {}