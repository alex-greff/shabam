import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { FingerprintInput } from '@/modules/fingerprint/dto/fingerprint.inputs';
import { SearchResult } from './models/search.models';
import { SearchService } from './search.service';

@Resolver((of) => SearchResult)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Mutation((returns) => SearchResult, {
    description: 'Search for a track.',
  })
  async search(
    @Args('fingerprint', { description: 'Fingerprint data.' })
    fingerprint: FingerprintInput,
  ): Promise<SearchResult> {
    const fingerprintData = await fingerprint.fingerprintData;

    console.log('HERE');
    console.log(fingerprintData);

    // TODO: implement
    return {
      something: 'hi',
    };
  }
}
