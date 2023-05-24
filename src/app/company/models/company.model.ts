import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'company' })
export class Company {
  @Field((type) => ID)
  id: string;

  @Field()
  createdAt: string;

  @Field()
  name: string;

  @Field()
  parentId: string;

  @Field()
  independentCost: number

  @Field()
  childrenCost: number

  @Field()
  cost: number;

  @Field((type) => [Company])
  childrens: string[];
}
