import { compareHash, hashPassword } from "../auth/bcrypts";

describe("compareHash", () => {
  test("", () => {
    ["1234", "foobar", "taichi"].forEach((passwd) => {
      const hash = hashPassword(passwd);
      expect(compareHash(passwd, hash)).toEqual(true);
    });
  });
});
