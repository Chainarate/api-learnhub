import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import express from "express";
import { newRepositoryUser } from "./repositories/user";
import { newHandlerUser } from "./handlers/user";
import { newRepositoryBlacklist } from "./repositories/blacklist";
import { newHandlerMiddlerware } from "./auth/jwt";
import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";

async function main() {
  const db = new PrismaClient();
  const redis = createClient<any, any, any>();

  try {
    await redis.connect();
    await db.$connect();
  } catch (err) {
    console.error(err);
    return;
  }

  const repoUser = newRepositoryUser(db);
  const repoBlacklist = newRepositoryBlacklist(redis);
  const handlerUser = newHandlerUser(repoUser, repoBlacklist);
  const handlerMiddlerware = newHandlerMiddlerware(repoBlacklist);
  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);

  const port = process.env.PORT || 8000;
  const server = express();
  const userRounter = express.Router();
  const contentRouter = express.Router();
  const cors = require('cors')

  server.use(cors())
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  server.use("/user", userRounter);
  server.use("/content", contentRouter);

  // Check server status
  server.get("/", (_, res) => {
    return res.status(200).json({ status: "ok" }).end();
  });

  // User API
  userRounter.post("/register", handlerUser.register.bind(handlerUser));
  userRounter.post("/login", handlerUser.login.bind(handlerUser));
  userRounter.get(
    "/logout",
    handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware),
    handlerUser.logout.bind(handlerUser)
  );

  // Content API
  contentRouter.post(
    "/",
    handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware),
    handlerContent.createContent.bind(handlerContent)
  );
  contentRouter.get(
    "/usercontent",
    handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware),
    handlerContent.getUserContents.bind(handlerContent)
  );
  contentRouter.get("/", handlerContent.getContents.bind(handlerContent));
  contentRouter.get("/:id", handlerContent.getContentById.bind(handlerContent));
  contentRouter.post("/update", async (_, res) => {
    return res.status(400).json({ error: "missing params id" }).end();
  });
  contentRouter.post(
    "/update/:id",
    handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware),
    handlerContent.updateContent.bind(handlerContent)
  );
  contentRouter.delete(
    "/:id",
    handlerMiddlerware.jwtMiddleware.bind(handlerMiddlerware),
    handlerContent.deleteContent.bind(handlerContent)
  );

  // server
  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
