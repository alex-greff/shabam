import { ArtistEntity } from '@/entities/Artist.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ArtistInput } from './dto/artist.dto';
import { CollaborationType } from '@/modules/artist/models/artist.models';
import { TrackEntity } from '@/entities/Track.entity';
import { ArtistCollaborationEntity } from '@/entities/ArtistCollaboration.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: EntityRepository<ArtistEntity>,
    @InjectRepository(ArtistCollaborationEntity)
    private readonly artistCollaborationRepository: EntityRepository<ArtistCollaborationEntity>,
  ) {}

  async findArtistByName(name: string): Promise<ArtistEntity | null> {
    const artist = await this.artistRepository.findOne({ name });
    return artist;
  }

  async createArtist(name: string): Promise<ArtistEntity> {
    const artist = this.artistRepository.create({
      name,
    });
    await this.artistRepository.persistAndFlush(artist);
    return artist;
  }

  async findOrCreateArtistByName(name: string): Promise<ArtistEntity> {
    let artist = await this.findArtistByName(name);
    if (!artist) {
      artist = await this.createArtist(name);
    }
    return artist;
  }

  async addCollaboration(
    artist: ArtistEntity,
    type: CollaborationType,
    track: TrackEntity,
  ): Promise<ArtistCollaborationEntity> {
    const collaboration = this.artistCollaborationRepository.create({
      type,
      artist,
      track,
    });

    await this.artistCollaborationRepository.persistAndFlush(collaboration);

    return collaboration;
  }
}