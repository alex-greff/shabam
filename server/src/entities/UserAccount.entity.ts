import { Entity, PrimaryGeneratedColumn, Column, Check, OneToMany } from "typeorm";
import { Search } from "./Search.entity";
import { Track } from "./Track.entity";

@Entity()
@Check("char_length(username) >= 6 AND char_length(username) <= 15")
export class UserAccount {
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

  @OneToMany(() => Search, search => search.user)
  searches: Search[];

  @OneToMany(() => Track, track => track.uploaderUser)
  uploadedTracks: Track[];
}