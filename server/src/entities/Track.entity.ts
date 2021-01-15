import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { UserAccountEntity } from "./UserAccount.entity";
import { SearchEntity } from "./Search.entity";
import { ArtistEntity } from "./Artist.entity";

@Entity({ name: "track" })
export class TrackEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @ManyToOne(() => UserAccountEntity, user => user.uploadedTracks, { eager: true })
  uploaderUser: UserAccountEntity;

  @ManyToOne(() => SearchEntity, search => search.track)
  searches: Promise<SearchEntity[]>;

  @ManyToMany(() => ArtistEntity, { eager: true })
  @JoinTable()
  artists: ArtistEntity[];
}