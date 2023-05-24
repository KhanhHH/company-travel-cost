import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { CompanyService } from './company.service';

import { companiesMock, travelsMock } from '../../mock/data';
import { CompanyFetcherService } from './company-fetcher.service';
import { CompanyResolver } from './company.resolver';

describe('Test suite', () => {
  let companyResolver: CompanyResolver;
  let companyService: CompanyService;
  let companyFetcherService: CompanyFetcherService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyResolver,
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

    companyResolver = module.get<CompanyResolver>(CompanyResolver);
    companyService = module.get<CompanyService>(CompanyService);
    companyFetcherService = module.get<CompanyFetcherService>(
      CompanyFetcherService,
    );
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
  });
  it('should return result in array', async () => {
    const result = await companyResolver.getTravelCostByCompanyId('uuid-1');
    expect(Array.isArray(result)).toEqual(true);
  });

  // uuid-1 is holding company (parent of all others company)
  // so, the travel cost of this company also is sum of travel data
  it('uuid-1 cost should be equal sum of all travel cost in the list', async () => {
    const result = await companyResolver.getTravelCostByCompanyId('uuid-1');
    const firstNodeCost = result[0].cost;
    const travelCostSum = travelsMock
      .map(({ price }) => parseFloat(price))
      .reduce((a, b) => a + b, 0);
    console.log('should be equal', { firstNodeCost, travelCostSum });
    expect(firstNodeCost).toEqual(travelCostSum);
  });

  // This test is only work on tree that having depth level 1
  it('uuid-3 cost should be sum of their independent cost and children cost', async () => {
    const independentCost =
      companyService.calculateIndependentTravelCostByCompanyId(
        travelsMock,
        'uuid-3',
      );
    const childrens = companyService.findAllCompanyByParentId(
      companiesMock,
      'uuid-3',
    );
    let childrenCost = 0;
    childrens.forEach((child) => {
      const childCost = travelsMock
        .filter((travel) => travel.companyId === child.id)
        .map(({ price }) => parseFloat(price))
        .reduce((a, b) => a + b, 0);
      childrenCost += childCost;
    });

    const result = await companyResolver.getTravelCostByCompanyId('uuid-3');
    const cost = result[0].cost;
    const exceptCost = independentCost + childrenCost;
    console.log('should be equal', {
      cost,
      independentCost,
      childrenCost,
      'independentCost + childrenCost;': exceptCost,
    });
    expect(cost).toEqual(exceptCost);
  });
});
