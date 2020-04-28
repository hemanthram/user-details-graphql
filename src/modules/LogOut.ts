import { Resolver, Mutation, Ctx, Authorized } from "type-graphql";
import { MyContext } from "../types/MyContext";

@Resolver()
export class LogOutResolver {
    @Authorized("LOGIN")
    @Mutation(() => String)
    async logout(
        @Ctx() ctx:MyContext){
            ctx.req.session!.destroy((err) => {
                if(err){console.log(err)}
            })
            return 'Logged Out';
        }
}