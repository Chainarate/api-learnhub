"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
async function main() {
    dotenv_1.default.config();
    const db = new client_1.PrismaClient();
    try {
        console.log("inspect env:", process.env);
        db.$connect();
    }
    catch (err) {
        console.error({ err });
    }
}
main();
//# sourceMappingURL=nodeserver.js.map