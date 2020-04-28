import { Resolver, Query, Ctx, Authorized } from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { prisma } from "../../prisma"

@Resolver()
export class MeResolver {
    
    @Authorized("LOGIN")
    @Query(() => User, {nullable: true})
    async me(@Ctx() ctx : MyContext) {
        if(!ctx.req.session!.userId) {
            return null;
        }
        return prisma.user.findOne(ctx.req.session!.userId);
    }
}