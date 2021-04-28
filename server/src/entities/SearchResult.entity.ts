import { TrackEntity } from '../entities/Track.entity';
import { SearchEntity } from '../entities/Search.entity';
import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'search_result' })
export class SearchResultEntity {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => SearchEntity)
  search!: SearchEntity;

  @ManyToOne(() => TrackEntity, { cascade: [Cascade.REMOVE] })
  track!: TrackEntity;

  @Property()
  similarity!: number;
}
