import { CompanyService } from './company.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  exports: [CompanyService],
  controllers: [],
  providers: [CompanyService],
})
export class CompanyModule {}
