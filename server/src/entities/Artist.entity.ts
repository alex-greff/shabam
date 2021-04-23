import { ArtistType } from '@/modules/catalog/models/catalog.models';
import { Collection, Entity, Enum, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from "uuid";
import { TrackEntity } from './Track.entity';

@Entity({ tableName: "artist" })
export class ArtistEntity {
  @PrimaryKey()
  id: string = v4();

  @Property({ unique: true })
  name: string;

  @Enum()
  type!: ArtistType;

  @ManyToMany(() => TrackEntity, "artists", { owner: true })
  tracks = new Collection<TrackEntity>(this);
}