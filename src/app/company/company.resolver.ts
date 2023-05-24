import { Args, Query, Resolver } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { lastValueFrom } from 'rxjs';
import { Company } from './models/company.model';

@Resolver(of => Company)
export class CompanyResolver {
  constructor(private companyService: CompanyService) {}

  @Query(returns => [Company])
  getTravelCostByCompanyId(@Args('id') id :string) {
    return this.companyService.getTravelCostByCompanyId(id)
  }
}
