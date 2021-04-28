import { CollaborationType } from '@/modules/artist/models/artist.models';
import { Cascade, Entity, Enum, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ArtistEntity } from './Artist.entity';
import { TrackEntity } from './Track.entity';

@Entity({ tableName: 'artist_collaboration' })
export class ArtistCollaborationEntity {
  @PrimaryKey()
  id!: number;

  @Enum()
  type!: CollaborationType;

  @ManyToOne(() => TrackEntity, { cascade: [Cascade.REMOVE] })
  track!: TrackEntity;

  @ManyToOne(() => ArtistEntity)
  artist!: ArtistEntity;
}
