import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
//import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import { RegisterResolver } from "./modules/user/Register";
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { PostResolver } from "./modules/post/Addpost";
import { LogOutResolver } from "./modules/LogOut";
import { DeletePostResolver } from "./modules/post/DeleteEditPost"
import { PrismaClient } from "@prisma/client";

const main = async () => {
  //await createConnection();
  const schema = await buildSchema({
    resolvers: [RegisterResolver,LoginResolver,MeResolver,PostResolver,LogOutResolver,DeletePostResolver],
    authChecker: ({context : {req}},roles) => {
      if(roles[0] == 'LOGIN'){
      if(!!!req.session!.userId){
        throw new Error("Already Logged In");
      }
      return !!req.session!.userId;}
      else{
      return !!!req.session!.userId;}
    } 
  });

  const prisma = new PrismaClient()
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req, prisma })
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000"
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "qid",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
      }
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
