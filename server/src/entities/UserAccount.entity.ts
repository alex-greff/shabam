import { Entity, PrimaryGeneratedColumn, Column, Check, OneToMany } from "typeorm";
import { SearchEntity } from "./Search.entity";
import { TrackEntity } from "./Track.entity";

@Entity({ name: "user_account" })
@Check("char_length(username) >= 6 AND char_length(username) <= 15")
export class UserAccountEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", length: 15, unique: true })
  username: string;

  @Column({ type: "varchar", length: 60 })
  password: string;

  @Column({ type: "varchar", length: 50 })
  role: string;

  @Column({ type: "timestamp" })
  signupDate: Date;

  @Column({ type: "timestamp", nullable: true })
  lastLogin: Date | null;

  @OneToMany(() => SearchEntity, search => search.user)
  searches: Promise<SearchEntity[]>;

  @OneToMany(() => TrackEntity, track => track.uploaderUser)
  uploadedTracks: Promise<TrackEntity[]>;
}