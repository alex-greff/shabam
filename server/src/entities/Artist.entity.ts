import { ArtistType } from '@/modules/catalog/models/catalog.models';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'artist' })
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: "int" })
  type: ArtistType;
}
