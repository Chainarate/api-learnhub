"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerContent = void 0;
const oembed_1 = require("../services/oembed");
function newHandlerContent(repoContent) {
    return new HandlerContent(repoContent);
}
exports.newHandlerContent = newHandlerContent;
class HandlerContent {
    constructor(repo) {
        this.repo = repo;
    }
    async createContent(req, res) {
        const { videoUrl, comment, rating } = req.body;
        if (!videoUrl || !comment || !rating) {
            return res
                .status(400)
                .json({ error: "missing videoUrl or comment or rating in json body" })
                .end();
        }
        if (rating < 0 && rating > 5) {
            return res.status(400).json({ error: "rating 0-5" }).end();
        }
        const userId = req.payload.id;
        const createdAt = new Date();
        const updatedAt = new Date();
        const { videoTitle, thumbnailUrl, creatorName, creatorUrl } = await (0, oembed_1.getVideoDetails)(videoUrl);
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
    async getContents(_, res) {
        return this.repo
            .getContents()
            .then((contents) => res.status(200).json(contents).end())
            .catch((err) => {
            console.error(`failed to get content: ${err}`);
            return res.status(500).json({ error: `failed to get contents` }).end();
        });
    }
    async getContentById(req, res) {
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
    async getUserContents(req, res) {
        return this.repo
            .getUserContents(req.payload.id)
            .then((contents) => res.status(200).json(contents).end())
            .catch((err) => {
            console.error(`failed to get contents: ${err}`);
            return res.status(500).json({ error: `failed to get contents` }).end();
        });
    }
    async updateContent(req, res) {
        const contentId = Number(req.params.id);
        // isNaN checks if its arg is NaN
        if (isNaN(contentId)) {
            return res
                .status(400)
                .json({ error: `id ${req.params.id} is not a number` });
        }
        const { comment, rating } = req.body;
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
    async deleteContent(req, res) {
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
//# sourceMappingURL=content.js.map