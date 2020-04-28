import { ObjectType, Field, ID} from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Post {
  @Field(() => ID)  id: number;
  @Field()  title: string;
  @Field()  author: number;
  @Field(() => User) by: User;
}
