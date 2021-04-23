import { ArtistEntity } from "@/entities/Artist.entity";
import { ArtistCollaborationEntity } from "@/entities/ArtistCollaboration.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Global, Module } from "@nestjs/common";
import { ArtistService } from "./artist.service";

@Global()
@Module({
  imports: [
    MikroOrmModule.forFeature([ArtistEntity, ArtistCollaborationEntity]),
  ],
  providers: [
    ArtistService
  ],
  exports: [
    ArtistService
  ]
})
export class ArtistModule {}