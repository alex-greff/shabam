import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { Request, Response } from "express";

export interface AppSession extends Express.Session {
  userData?: UserData;
}

export interface AppRequest extends Express.Request, Request {
  session?: AppSession;
}

export interface AppResponse extends Response {}

export interface AppContext extends ExpressContext {
  req: AppRequest;
  res: AppResponse;
}

export interface RoleCheckConfig {
  userUsernamePath: string;
}

export interface UserData {
  username: string;
  role: string;
}
