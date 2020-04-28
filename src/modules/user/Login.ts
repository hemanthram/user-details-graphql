import { User } from "../../entity/User";
import { Resolver, Arg, Mutation, Ctx, Authorized } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import bcrypt from "bcryptjs";
import { prisma } from "../../prisma"


@Resolver()
export class LoginResolver {

    @Authorized("LOGOUT")
    @Mutation(() => User, {nullable:true})
    async login (
        @Arg("email") email:string,
        @Arg("password") password:string,
        @Ctx() ctx: MyContext) {
            
            const user = await prisma.user.findOne({where : {email}})
            if(!user) {
                return null;                
            }
            
            const valid = bcrypt.compare(password, user.password)
            if(!valid) {
                return null
            }

            ctx.req.session!.userId = user.id;
            return user;
        }
}