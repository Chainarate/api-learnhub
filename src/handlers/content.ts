import { Request, Response } from "express";
import { IRepositoryContent } from "../repositories";
import { Empty, IHandlerContent, WithContent, WithContentId } from ".";
import { JwtAuthRequest } from "../auth/jwt";
import { getVideoDetails } from "../services/oembed";

export function newHandlerContent(
  repoContent: IRepositoryContent
): IHandlerContent {
  return new HandlerContent(repoContent);
}

class HandlerContent implements IHandlerContent {
  private repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async createContent(
    req: JwtAuthRequest<Request, WithContent>,
    res: Response
  ): Promise<Response> {
    const { videoUrl, comment, rating } = req.body;

    if (!videoUrl) {
      return res
        .status(400)
        .json({ error: "missing videoUrl rating in json body" })
        .end();
    }

    if (rating > 0 && rating < 5) {
      return res.status(400).json({ error: "rating 0-5" }).end();
    }

    const userId = req.payload.id
    const createdAt = new Date();
    const updatedAt = new Date();

    const { videoTitle, thumbnailUrl, creatorName, creatorUrl } =
      await getVideoDetails(videoUrl);

    return this.repo
      .createContent({
        videoTitle,
        videoUrl,
        thumbnailUrl,
        creatorName,
        creatorUrl,
        comment,
        rating,
        createdAt,
        updatedAt,
        userId,
      })
      .then((todo) => res.status(201).json(todo).end())
      .catch((err) => {
        console.error(`failed to create todo: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to create content` })
          .end();
      });
  }

  async getContents(_, res: Response): Promise<Response> {
    return this.repo
      .getContents()
      .then((contents) => res.status(200).json({data: contents}).end())
      .catch((err) => {
        console.error(`failed to get content: ${err}`);
        return res.status(500).json({ error: `failed to get contents` }).end();
      });
  }

  async getContentById(
    req: JwtAuthRequest<WithContentId, WithContent>,
    res: Response
  ): Promise<Response> {
    const contentId = Number(req.params.id);

    if (isNaN(contentId)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .getContentById(contentId)
      .then((content) => {
        if (!content) {
          return res
            .status(404)
            .json({ error: `no such todo: ${contentId}` })
            .end();
        }

        return res.status(200).json(content).end();
      })
      .catch((err) => {
        const errMsg = `failed to get todo ${contentId}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }

  async getUserContents(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return this.repo
      .getUserContents(req.payload.id)
      .then((contents) => res.status(200).json(contents).end())
      .catch((err) => {
        console.error(`failed to get contents: ${err}`);
        return res.status(500).json({ error: `failed to get contents` }).end();
      });
  }

  async updateContent(
    req: JwtAuthRequest<WithContentId, WithContent>,
    res: Response
  ): Promise<Response> {
    const contentId = Number(req.params.id);
    // isNaN checks if its arg is NaN
    if (isNaN(contentId)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }
    const { comment, rating } = req.body;
    console.log(comment, rating)

    if (!comment || !rating) {
      return res
        .status(400)
        .json({ error: "missing comment or rating in json body" })
        .end();
    }

    if (rating < 0 && rating > 5) {
      return res.status(400).json({ error: "rating 0-5" }).end();
    }

    const updateAt = new Date();

    return this.repo
      .updateUserContent({
        comment,
        rating,
        id: contentId,
        userId: req.payload.id,
        updateAt,
      })
      .then((updated) => res.status(201).json(updated).end())
      .catch((err) => {
        const errMsg = `failed to update content ${contentId}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async deleteContent(
    req: JwtAuthRequest<WithContentId, WithContent>,
    res: Response
  ): Promise<Response> {
    const contentId = Number(req.params.id);
    // isNaN checks if its arg is NaN
    if (isNaN(contentId)) {
      return res
        .status(400)
        .json({ error: `id ${req.params.id} is not a number` });
    }

    return this.repo
      .deleteUserContentById({ id: contentId, userId: req.payload.id })
      .then((deleted) => res.status(200).json(deleted).end())
      .catch((err) => {
        console.error(`failed to delete content ${contentId}: ${err}`);
        return res
          .status(500)
          .json({ error: `failed to delete content ${contentId}` });
      });
  }
}
