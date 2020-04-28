import { ObjectType, Field, ID } from "type-graphql";
import { Post } from './Post';

@ObjectType()
export class User {
  @Field(() => ID)  id: number;
  @Field()  firstName: string;
  @Field()  lastName: string;
  @Field()  email: string;
  @Field()  name: string;
  @Field(() => [Post],{nullable:true})  posts: [Post];
}
