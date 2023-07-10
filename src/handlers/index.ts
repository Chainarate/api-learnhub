import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export interface Empty {}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;

export interface WithContentId {
  id: string;
}
export interface WithUser {
  username: string;
  name: string;
  password: string;
}

export interface WithContent {
  videoUrl: string;
  comment: string;
  rating: number;
}

export interface IHandlerUser {
  logout(req: JwtAuthRequest<Empty, Empty>, res: Response): Promise<Response>;
  login(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  register(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  getId(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response>
}

export interface IHandlerContent {
  createContent(
    req: JwtAuthRequest<Request, WithContent>,
    res: Response
  ): Promise<Response>;
  getContents(_, res: Response): Promise<Response>;
  getContentById(
    req: JwtAuthRequest<WithContentId, WithContent>,
    res: Response
  ): Promise<Response>;
  getUserContents(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response>;
  updateContent(
    req: JwtAuthRequest<WithContentId, WithContent>,
    res: Response
  ): Promise<Response>;
  deleteContent(
    req: JwtAuthRequest<WithContentId, WithContent>,
    res: Response
  ): Promise<Response>;
}
