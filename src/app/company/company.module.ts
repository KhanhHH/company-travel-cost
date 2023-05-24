import { HttpModule, HttpService } from '@nestjs/axios';
import { CompanyService } from './company.service';
import { Module } from '@nestjs/common';
import { CompanyResolver } from './company.resolver';
import { CompanyFetcherService } from './company-fetcher.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://5f27781bf5d27e001612e057.mockapi.io/webprovise/',
      timeout: 10000,
    }),
  ],
  exports: [CompanyService, CompanyFetcherService],
  controllers: [],
  providers: [CompanyService, CompanyFetcherService, CompanyResolver],
})
export class CompanyModule {}
