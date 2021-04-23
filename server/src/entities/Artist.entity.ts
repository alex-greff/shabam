import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { ArtistCollaborationEntity } from './ArtistCollaboration.entity';

@Entity({ tableName: "artist" })
export class ArtistEntity {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name: string;

  @OneToMany(() => ArtistCollaborationEntity, collaboration => collaboration.artist)
  collaborations = new Collection<ArtistCollaborationEntity>(this);
}