import { Test } from '@nestjs/testing';
import { CompanyService } from './company.service';

describe('Test suite', () => {
    let companyService: CompanyService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [CompanyService],
        }).compile();

        companyService = module.get<CompanyService>(CompanyService);
    });

    it('should be defined', () => {
        expect(companyService).toBeDefined();
    });
    it('output is lmao', () => {
        expect(companyService.findCompanyTravelCost()).toEqual('lmao');
    });
});