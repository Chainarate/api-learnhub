import { PrismaClient } from "@prisma/client";
import { IContent, ICreateContent } from "../entities";
import { IRepositoryContent } from ".";

export function newRepositoryContent(db: PrismaClient) {
  return new RepositoryContent(db);
}

class RepositoryContent implements IRepositoryContent {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createContent(content: ICreateContent): Promise<IContent> {
    return await this.db.content.create({
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
            password: false,
          },
        },
      },
      data: {
        ...content,
        userId: undefined,
        postedBy: {
          connect: {
            id: content.userId,
          },
        },
       },
    });
  }

  async getContents(): Promise<IContent[]> {
    return await this.db.content.findMany({
      include: {
        postedBy: {
          select: {
            id: true,
            username: true,
            name: true,
            registeredAt: true,
            password: false,
          },
        },
      }});
  }

  async getContentById(id: number): Promise<IContent | null> {
    return await this.db.content.findUnique({ where: { id },include: {
      postedBy: {
        select: {
          id: true,
          username: true,
          name: true,
          registeredAt: true,
          password: false,
        },
      },
    } });
  }

  async getUserContents(userId: string): Promise<IContent[]> {
    return await this.db.content.findMany({ where: { userId } });
  }

  async updateUserContent(arg: {
    comment: string;
    rating: number;
    id: number;
    userId: string;
  }): Promise<IContent> {
    return await this.db.content.update({
      where: { id: arg.id },
      data: { comment: arg.comment, rating: arg.rating },
    });
  }

  async deleteUserContentById(arg: {
    id: number;
    userId: string;
  }): Promise<IContent> {
    const content = await this.db.content.findFirst({
      where: { id: arg.id, userId: arg.userId },
    });

    if (!content) {
      return Promise.reject(`no such content ${arg.id} not found`);
    }

    return this.db.content.delete({ where: { id: arg.id } });
  }
}
