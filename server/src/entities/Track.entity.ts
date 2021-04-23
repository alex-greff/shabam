import { UserAccountEntity } from './UserAccount.entity';
import { SearchResultEntity } from './SearchResult.entity';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { ArtistCollaborationEntity } from './ArtistCollaboration.entity';

@Entity({ tableName: "track" })
export class TrackEntity {
  @PrimaryKey()
  id!: number;

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

  @OneToMany(() => ArtistCollaborationEntity, collaboration => collaboration.track)
  collaborators = new Collection<ArtistCollaborationEntity>(this);
}