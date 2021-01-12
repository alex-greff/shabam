import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserAccount } from "./UserAccount.entity";
import { Track } from "./Track.entity";

@Entity()
export class Search {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => UserAccount, user => user.searches)
  user: UserAccount;

  @ManyToOne(() => Track, track => track.searches, { nullable: true })
  track: Track | null;

  @Column({ type: "timestamp" })
  searchDate: Date;
}