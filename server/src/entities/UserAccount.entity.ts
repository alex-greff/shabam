import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  OneToMany,
} from 'typeorm';
import { SearchEntity } from './Search.entity';
import { TrackEntity } from './Track.entity';
import { UserRoles } from '@/modules/policies/policy.types';

@Entity({ name: 'user_account' })
@Check('char_length(username) >= 5 AND char_length(username) <= 15')
export class UserAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'integer' })
  role: UserRoles;

  @Column({ type: "timestamp with time zone" })
  signupDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  lastLogin: Date | null;

  @OneToMany(() => SearchEntity, (search) => search.user)
  searches: Promise<SearchEntity[]>;

  @OneToMany(() => TrackEntity, (track) => track.uploaderUser)
  uploadedTracks: Promise<TrackEntity[]>;
}
