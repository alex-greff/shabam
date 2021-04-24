import { Global, Module } from "@nestjs/common";
import { FingerprintService } from "./fingerprint.service";

@Global()
@Module({
  providers: [
    FingerprintService
  ],
  exports: [
    FingerprintService
  ]
})
export class FingerprintModule {}