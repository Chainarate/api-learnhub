import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IRepositoryBlacklist } from "../repositories";

export interface Payload {
  id: string;
  username: string;
  name: string
}

const secret = "content-secret";

export function newJwt(data: Payload): string {
  return jwt.sign(data, secret, {
    algorithm: "HS512",
    expiresIn: "12h",
    issuer: "content-api",
    subject: "registration",
    audience: "user",
  });
}

export interface JwtAuthRequest<Params, Body>
  extends Request<Params, any, Body> {
  token: string;
  payload: Payload;
}

export function newHandlerMiddlerware(
  repoBlacklist: IRepositoryBlacklist
): IHandlerMiddleware {
  return new HandlerMiddlerware(repoBlacklist);
}

interface IHandlerMiddleware {
  jwtMiddleware(
    req: JwtAuthRequest<any, any>,
    res: Response,
    next: NextFunction
  );
}

class HandlerMiddlerware implements IHandlerMiddleware {
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repoBlacklist: IRepositoryBlacklist) {
    this.repoBlacklist = repoBlacklist;
  }

  async jwtMiddleware(
    req: JwtAuthRequest<any, any>,
    res: Response,
    next: NextFunction
  ) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    try {
      if (!token) {
        return res.status(401).json({ error: "missing JWT token" }).end();
      }

      const isBlacklisted = await this.repoBlacklist.isBlacklisted(token);

      if (isBlacklisted) {
        return res.status(401).json({ error: `token is blacklist` }).end();
      }

      const decoded = jwt.verify(token, secret);
      const id = decoded["id"];
      const username = decoded["username"];

      req.token = token;
      req.payload = {
        id: id,
        username: username,
      };

      return next();
    } catch (err) {
      console.error(`Auth failed for token ${token}: ${err}`);
      return res.status(400).json({ error: "authentication failed" }).end();
    }
  }
}
