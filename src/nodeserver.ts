import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

async function main() {
  dotenv.config();
  const db = new PrismaClient();

  try {
    console.log("inspect env:", process.env);
    db.$connect();
  } catch (err) {
    console.error({ err });
  }
}

main();
