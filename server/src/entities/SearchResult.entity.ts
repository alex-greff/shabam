import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TrackEntity } from './Track.entity';
import { SearchEntity } from './Search.entity';

@Entity({ name: "search_result" })
export class SearchResultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => SearchEntity, (search) => search.results)
  search: Promise<SearchEntity>;

  @ManyToOne(() => TrackEntity, (track) => track.searchResults)
  track: Promise<TrackEntity>;

  @Column({ type: "float" })
  similarity: string;
}
