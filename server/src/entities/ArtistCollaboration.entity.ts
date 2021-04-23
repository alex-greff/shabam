import { CollaborationType } from "@/modules/artist/models/artist.models";
import { Entity, Enum, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { ArtistEntity } from "./Artist.entity";
import { TrackEntity } from "./Track.entity";

@Entity({ tableName: "artist_collaboration" })
export class ArtistCollaborationEntity {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: CollaborationType;

  @ManyToOne(() => TrackEntity)
  track!: TrackEntity;

  @ManyToOne(() => ArtistEntity)
  artist!: ArtistEntity;
}