import { UserAccountEntity } from './UserAccount.entity';
import { ArtistEntity } from './Artist.entity';
import { SearchResultEntity } from './SearchResult.entity';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from "uuid";

@Entity({ tableName: "track" })
export class TrackEntity {
  @PrimaryKey()
  id: string = v4();

  @Property()
  title!: string;

  @Property({ nullable: true })
  coverImage?: string;

  @Property({ columnType: "integer" })
  addressDatabase!: number;

  @Property({ nullable: true })
  releaseDate?: Date;

  @Property()
  createdDate!: Date;
  
  @Property()
  updateDate!: Date;

  @ManyToOne(() => UserAccountEntity)
  uploaderUser!: UserAccountEntity;

  @OneToMany(() => SearchResultEntity, searchResult => searchResult.track)
  searchResults = new Collection<SearchResultEntity>(this);

  @ManyToMany(() => ArtistEntity, artist => artist.tracks)
  artists = new Collection<ArtistEntity>(this);
}