import { Global, Module } from "@nestjs/common";
import { RecordsService } from "./records.service";

@Global()
@Module({
  providers: [
    RecordsService
  ],
  exports: [
    RecordsService
  ]
})
export class RecordsModule {}