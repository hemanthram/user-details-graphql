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
        prisma.post.delete({where:{title ,author: ctx.req.session!.userId}});
        return  `Deleted post with title ${title}`
    }

    @Authorized("LOGIN")
    @Mutation(() => String, {nullable:true})
    async editpost(
        @Arg("title") title: string,
        @Arg("replace") replace: string,
        @Ctx() ctx: MyContext
    ) {
        const chk = await prisma.post.findOne({where:{title,author: ctx.req.session!.userId}})
        if(!chk){return "Title does not exist"}
        await prisma.post.delete({where:{title,author: ctx.req.session!.userId}});   
        await prisma.post.create({data:{title:replace,author:ctx.req.session!.userId}});
        return  `Replaced post with title ${title} with ${replace}`
    }

}
