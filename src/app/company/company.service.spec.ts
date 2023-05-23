import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { CompanyService } from './company.service';

import { companiesMock, travelsMock } from '../../mock/data';

describe('Test suite', () => {
  let companyService: CompanyService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
  });
  it('API fetching is OK', async () => {
    companyService.fetchData = jest.fn().mockResolvedValue({
      companies: companiesMock,
      travels: travelsMock,
    });

    const res = await companyService.fetchData();
    expect(res).toEqual({
      companies: companiesMock,
      travels: travelsMock,
    });
  });
  it('Get particular company travel cost', async () => {
    companyService.fetchData = jest.fn().mockResolvedValue({
      companies: companiesMock,
      travels: travelsMock,
    });

    const ouput = await companyService.getCompanyTravelCostByCompanyId('uuid-1');
    expect(ouput[0].cost).toEqual(52983);
  });
});
