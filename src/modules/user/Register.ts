import {Resolver,  Query,  Mutation,  Arg,  FieldResolver,  Root, Authorized,} from "type-graphql";
import { User } from "../../entity/User";
//import { Post } from "../../entity/Post";
import bcrypt from "bcryptjs";
import {RegisterInput} from './RegisterInput'
import { prisma } from "../../prisma"

@Resolver(User)
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Authorized("LOGOUT")
  @Query(() => [User])
  async viewusers() {
    return prisma.user.findMany();
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }


  @Authorized("LOGOUT")
  @Mutation(() => User)
  async register(@Arg("data")
  {
    firstName,
    lastName,
    email,
    password
  }: RegisterInput) {
    const hashedPassword = await bcrypt.hash(password,12);
    return await prisma.user.create({data:
    {
      firstName,
      lastName,
      email,
      password:hashedPassword
    }})
  }
}