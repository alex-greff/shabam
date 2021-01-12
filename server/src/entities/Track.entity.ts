import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { UserAccount } from "./UserAccount.entity";
import { Search } from "./Search.entity";
import { Artist } from "./Artist.entity";

@Entity()
export class Track {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", length: 50 })
  title: string;

  @Column({ type: "varchar", length: 355 })
  coverImage: string;

  @Column({ type: "integer" })
  addressDatabase: number;

  @Column({ type: "timestamp", nullable: true })
  releaseDate: Date | null;

  @Column({ type: "timestamp" })
  createdDate: Date;
  
  @Column({ type: "timestamp" })
  updateDate: Date;

  @ManyToOne(() => UserAccount, user => user.uploadedTracks)
  uploaderUser: UserAccount;

  @ManyToOne(() => Search, search => search.track)
  searches: Search[];

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: Artist[];
}