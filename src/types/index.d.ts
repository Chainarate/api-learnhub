import { Payload } from "../auth/index";
import { Express } from "express";
import { Session, SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    payload: Payload;
  }
}

declare namespace Express {
  interface Request {
    session: SessionData & Session;
  }
}
