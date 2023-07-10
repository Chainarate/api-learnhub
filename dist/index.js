"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const redis_1 = require("redis");
const express_1 = __importDefault(require("express"));
const user_1 = require("./repositories/user");
const user_2 = require("./handlers/user");
const blacklist_1 = require("./repositories/blacklist");
const jwt_1 = require("./auth/jwt");
const content_1 = require("./repositories/content");
const content_2 = require("./handlers/content");
async function main() {
    const db = new client_1.PrismaClient();
    const redis = (0, redis_1.createClient)();
    try {
        await redis.connect();
        await db.$connect();
    }
    catch (err) {
        console.error(err);
        return;
    }
    const repoUser = (0, user_1.newRepositoryUser)(db);
    const repoBlacklist = (0, blacklist_1.newRepositoryBlacklist)(redis);
    const handlerUser = (0, user_2.newHandlerUser)(repoUser, repoBlacklist);
    const handlerMiddlerware = (0, jwt_1.newHandlerMiddlerware)(repoBlacklist);
    const repoContent = (0, content_1.newRepositoryContent)(db);
    const handlerContent = (0, content_2.newHandlerContent)(repoContent);
    const port = process.env.PORT || 8000;
    const server = (0, express_1.default)();
    const userRouter = express_1.default.Router();
    const contentRouter = express_1.default.Router();
    const authRouter = express_1.default.Router();
    const cors = require('cors');
    server.use(cors());
    server.use(express_1.default.json());
    server.use(express_1.default.urlencoded({ extended: false }));
    server.use("/user", userRouter);
    server.use("/content", contentRouter);
    server.use("/auth", authRouter);
    // Check server status
    server.get("/", (_, res) => {
        return res.status(200).json({ status: "ok" }).end();
    });
    // User API
    userRouter.post("/", handlerUser.register.bind(handlerUser));
    authRouter.post("/login", handlerUser.login.bind(handlerUser));
    authRouter.get("/me", handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware), handlerUser.getId.bind(handlerUser));
    authRouter.get("/logout", handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware), handlerUser.logout.bind(handlerUser));
    // Content API
    contentRouter.post("/", handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware), handlerContent.createContent.bind(handlerContent));
    // (Optional) Add usercontent
    contentRouter.get("/usercontent", handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware), handlerContent.getUserContents.bind(handlerContent));
    contentRouter.get("/", handlerContent.getContents.bind(handlerContent));
    contentRouter.get("/:id", handlerContent.getContentById.bind(handlerContent));
    // contentRouter.post("/update", async (_, res) => {
    //   return res.status(400).json({ error: "missing params id" }).end();
    // });
    contentRouter.patch("/:id", handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware), handlerContent.updateContent.bind(handlerContent));
    contentRouter.delete("/:id", handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware), handlerContent.deleteContent.bind(handlerContent));
    // server
    server.listen(port, () => console.log(`server listening on ${port}`));
}
main();
//# sourceMappingURL=index.js.map