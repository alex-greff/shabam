import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserAccountEntity } from './UserAccount.entity';
import { TrackEntity } from './Track.entity';

@Entity({ name: "search" })
export class SearchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => UserAccountEntity, (user) => user.searches, { eager: true})
  user: UserAccountEntity;

  @ManyToOne(() => TrackEntity, (track) => track.searches, {
    nullable: true,
    eager: true,
  })
  track: TrackEntity | null;

  @Column({ type: 'timestamp' })
  searchDate: Date;
}
