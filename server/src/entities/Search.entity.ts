import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { UserAccountEntity } from './UserAccount.entity';
import { TrackEntity } from './Track.entity';
import { SearchResultEntity } from './SearchResult.entity';

@Entity({ name: "search" })
export class SearchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => UserAccountEntity, (user) => user.searches, { eager: true})
  user: UserAccountEntity;

  @OneToMany(() => SearchResultEntity, (searchResult) => searchResult.search, { eager: true })
  results: SearchResultEntity[];

  // @ManyToOne(() => TrackEntity, (track) => track.searches, {
  //   nullable: true,
  //   eager: true,
  // })
  // track: TrackEntity | null;

  @Column({ type: 'timestamp' })
  searchDate: Date;
}
