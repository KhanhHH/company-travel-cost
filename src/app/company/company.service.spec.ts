import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { CompanyService } from './company.service';

import { companiesMock, travelsMock } from '../../mock/data';
import { CompanyFetcherService } from './company-fetcher.service';

describe('Test suite', () => {
  let companyService: CompanyService;
  let companyFetcherService: CompanyFetcherService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyFetcherService,
          useValue: {
            fetchData: jest.fn(() => ({
              companies: companiesMock,
              travels: travelsMock,
            })),
          },
        },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    companyFetcherService = module.get<CompanyFetcherService>(CompanyFetcherService);
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
  });

  it('should get correct company travel cost', async () => {
    const ouput = await companyService.getTravelCostByCompanyId('uuid-1');
    expect(ouput[0].cost).toEqual(52983);
  });
});
