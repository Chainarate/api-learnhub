"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRepositoryContent = void 0;
function newRepositoryContent(db) {
    return new RepositoryContent(db);
}
exports.newRepositoryContent = newRepositoryContent;
class RepositoryContent {
    constructor(db) {
        this.db = db;
    }
    async createContent(content) {
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
    async getContents() {
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
            },
        });
    }
    async getContentById(id) {
        return await this.db.content.findUnique({
            where: { id },
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
        });
    }
    async getUserContents(userId) {
        return await this.db.content.findMany({ where: { userId } });
    }
    async updateUserContent(arg) {
        return await this.db.content.update({
            where: { id: arg.id },
            data: { comment: arg.comment, rating: arg.rating },
        });
    }
    async deleteUserContentById(arg) {
        const content = await this.db.content.findFirst({
            where: { id: arg.id, userId: arg.userId },
        });
        if (!content) {
            return Promise.reject(`no such content ${arg.id} not found`);
        }
        return this.db.content.delete({ where: { id: arg.id } });
    }
}
//# sourceMappingURL=content.js.map