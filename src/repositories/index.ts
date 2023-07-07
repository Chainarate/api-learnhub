import { IContent, ICreateContent, ICreateUser, IUser } from "../entities";

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUserByUsername(username: string): Promise<IUser | null>;
}

export interface IRepositoryContent {
  createContent(content: ICreateContent): Promise<IContent>;
  getContents(): Promise<IContent[]>;
  getContentById(id: number): Promise<IContent | null>;
  updateUserContent(arg: {
    comment: string;
    rating: number;
    id: number;
    userId: string;
    updateAt: Date;
  }): Promise<IContent>;
  getUserContents(userId: string): Promise<IContent[]>;
  deleteUserContentById(arg: { id: number; userId: string }): Promise<IContent>;
}

export interface IRepositoryBlacklist {
  addToBlackList(token: string): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
}
