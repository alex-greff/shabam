import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Artist {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  name: string;
}