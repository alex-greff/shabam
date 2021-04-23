import { SearchEntity } from './Search.entity';
import { TrackEntity } from './Track.entity';
import { UserRole } from '@/modules/policies/policy.types';
import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from "uuid";

@Entity({ tableName: 'user_account' })
export class UserAccountEntity {
  @PrimaryKey()
  id: string = v4();

  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;

  @Enum()
  role!: UserRole;

  @Property()
  signupDate: Date;

  @Property({ nullable: true })
  lastLogin?: Date;

  @OneToMany(() => SearchEntity, search => search.user)
  searches = new Collection<SearchEntity>(this);

  @OneToMany(() => TrackEntity, track => track.uploaderUser)
  uploadedTracks = new Collection<TrackEntity>(this);
}
