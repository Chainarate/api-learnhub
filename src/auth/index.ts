import { Request } from "express";

export interface Payload {
  id: string;
  username: string;
  password?: string;
}

export interface JwtAuthRequest<Params, Body>
  extends Request<Params, any, Body> {
  token: string;
  payload: Payload;
}
