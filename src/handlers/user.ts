import { Response } from "express";

import { AppRequest, Empty, IHandlerUser, WithUser } from ".";
import { IRepositoryBlacklist, IRepositoryUser } from "../repositories";
import { compareHash, hashPassword } from "../auth/bcrypts";
import { JwtAuthRequest, Payload, newJwt } from "../auth/jwt";

export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
): IHandlerUser {
  return new HandlerUser(repo, repoBlacklist);
}

class HandlerUser implements IHandlerUser {
  private repo: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repo = repo;
    this.repoBlacklist = repoBlacklist;
  }

  async register(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, name, password } = req.body;
    const registeredAt = new Date();

    if (!username || !name || !password) {
      return res
        .status(400)
        .json({ error: "missing username or name or password in body" });
    }

    return this.repo
      .createUser({
        username,
        name,
        password: hashPassword(password),
        registeredAt,
      })
      .then((newUser) =>
        res
          .status(201)
          .json({ ...newUser, password: undefined })
          .end()
      )
      .catch((err) => {
        const errMsg = `failed to create user ${username}`;
        console.error(`${errMsg}: ${err}`);

        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async login(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password in body" });
    }

    return this.repo
      .getUserByUsername(username)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: `no such user: ${username}` });
        }

        if (!compareHash(password, user.password)) {
          return res.status(401).json({ error: `invalid credentail` });
        }

        const payload: Payload = { id: user.id, username: user.username };
        const token = newJwt(payload);

        return res.status(200).json({
          status: "logined",
          id: user.id,
          username: user.username,
          name: user.name,
          registeredAt: user.registeredAt,
          token,
        });
      })
      .catch((err) => {
        const errMsg = `failed to get user ${username}`;
        console.error(`${errMsg}: ${err}`);

        return res
          .status(500)
          .json({ error: `failed to login user ${username}` });
      });
  }

  async logout(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return this.repoBlacklist
      .addToBlackList(req.token)
      .then(() =>
        res.status(200).json({ status: `logged out successfully` }).end()
      )
      .catch((err) => {
        const errMsg = `failed to logout`;
        console.error(`${errMsg}: ${err}`);

        return res.status(500).json({ error: `failed to logout` });
      });
  }
}
