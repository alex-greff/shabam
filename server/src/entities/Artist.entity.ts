import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "artist" })
export class ArtistEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  name: string;
}