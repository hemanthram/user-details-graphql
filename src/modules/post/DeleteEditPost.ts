import {Resolver,  Mutation,  Arg, Authorized, Ctx} from "type-graphql";
// import { Post } from "../../entity/Post";
import { MyContext } from "../../types/MyContext";
import { prisma } from "../../prisma";

@Resolver()
export class DeletePostResolver {
    @Authorized("LOGIN")
    @Mutation(() => String, {nullable:true})
    async deletepost(
        @Arg("title") title: string,
        @Ctx() ctx: MyContext
    ) {
        await prisma.post.deleteMany({where:{title ,author: ctx.req.session!.userId}});
        return  `Deleted post with title ${title}`
    }

    @Authorized("LOGIN")
    @Mutation(() => String, {nullable:true})
    async editpost(
        @Arg("title") title: string,
        @Arg("replace") replace: string,
        @Ctx() ctx: MyContext
    ) {
        const chk = await prisma.post.findMany({where:{title,author: ctx.req.session!.userId}})
        if(chk.length === 0){return "Title does not exist"}
        await prisma.post.updateMany({where:{title,author: ctx.req.session!.userId}, data:{title:replace}});   
        return  `Replaced post with title ${title} with ${replace}`
    }

}
