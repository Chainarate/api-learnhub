"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypts_1 = require("../auth/bcrypts");
describe("compareHash", () => {
    test("", () => {
        ["1234", "foobar", "taichi"].forEach((passwd) => {
            const hash = (0, bcrypts_1.hashPassword)(passwd);
            expect((0, bcrypts_1.compareHash)(passwd, hash)).toEqual(true);
        });
    });
});
//# sourceMappingURL=bcrypts.test.js.map