import { Global, Module } from "@nestjs/common";
import { AddressService } from "./address.service";

@Global()
@Module({
  providers: [
    AddressService
  ],
  exports: [
    AddressService
  ]
})
export class AddressModule {}