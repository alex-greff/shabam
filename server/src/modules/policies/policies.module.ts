import { Global, Module } from '@nestjs/common';
import { PoliciesAbilityFactory } from './factories/policies-ability.factory';

@Global()
@Module({
  providers: [PoliciesAbilityFactory],
  exports: [PoliciesAbilityFactory]
})
export class PoliciesModule {}
