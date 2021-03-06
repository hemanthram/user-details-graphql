import {Resolver,  Mutation,  Arg, Authorized, Ctx, Query} from "type-graphql";
import { Post } from "../../entity/Post";
import { MyContext } from "../../../src/types/MyContext";
import { prisma } from "../../prisma"

@Resolver(Post)
export class PostResolver {
    @Authorized("LOGIN")
    @Mutation(() => Post, {nullable:true})
    async addpost(
        @Arg("title") title: string,
        @Ctx() ctx:MyContext
    ) {
        const chk = await prisma.post.findMany({where :{title,author: ctx.req.session!.userId}})
        if(chk.length === 0){
        return await prisma.post.create({data:{
            title,
            by : {connect:{
                id:ctx.req.session!.userId
            }}
        }})
        }
        return null;
    }
    
    @Query(() => [Post])
    async viewposts() {
        return await prisma.post.findMany({include:{by:true}});
    }
}
