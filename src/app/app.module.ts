import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
