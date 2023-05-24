import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { Observable, forkJoin, lastValueFrom, map } from 'rxjs';
import { Company } from './interfaces/company.interface';
import { Travel } from './interfaces/travel.interface';

@Injectable()
export class CompanyFetcherService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use((request) => {
      console.log('Starting Request', axios.getUri(request));
      return request;
    });
    this.httpService.axiosRef.interceptors.response.use((response) => {
      console.log('Response:', JSON.stringify(response?.data));
      return response;
    });
  }

  fetchAllCompany(): Observable<Company[]> {
    return this.httpService.get('/companies').pipe(map((data) => data.data));
  }
  fetchAllTravel(): Observable<Travel[]> {
    return this.httpService.get('/travels').pipe(map((data) => data.data));
  }

  fetchData() {
    return lastValueFrom(
      forkJoin({
        companies: this.fetchAllCompany(),
        travels: this.fetchAllTravel(),
      }),
    );
  }
}
