import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserAccountEntity } from './UserAccount.entity';
import { SearchResultEntity } from './SearchResult.entity';

@Entity({ name: 'search' })
export class SearchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => UserAccountEntity, (user) => user.searches, { eager: true })
  user: UserAccountEntity;

  @OneToMany(() => SearchResultEntity, (searchResult) => searchResult.search, {
    eager: true,
  })
  results: SearchResultEntity[];

  @Column({ type: 'timestamp with time zone' })
  searchDate: Date;
}
