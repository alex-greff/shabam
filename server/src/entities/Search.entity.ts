import { UserAccountEntity } from './UserAccount.entity';
import { SearchResultEntity } from './SearchResult.entity';
import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'search' })
export class SearchEntity {
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => UserAccountEntity)
  user!: UserAccountEntity;

  @OneToMany(() => SearchResultEntity, (searchResult) => searchResult.search, {
    cascade: [Cascade.REMOVE],
  })
  results = new Collection<SearchResultEntity>(this);

  @Property()
  searchDate: Date;
}
