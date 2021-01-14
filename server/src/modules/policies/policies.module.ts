import { Global, Module } from '@nestjs/common';
import { PoliciesAbilityFactory } from './factories/policies-ability.factory';
import { PoliciesGuard } from './guards/policies.guard';

@Global()
@Module({
  providers: [PoliciesAbilityFactory],
  exports: [PoliciesAbilityFactory]
})
export class PoliciesModule {}
