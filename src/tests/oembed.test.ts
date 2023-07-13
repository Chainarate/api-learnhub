import { getVideoDetails } from "../services/oembed";

describe("oembed", () => {
  test("", async () => {
    const tests = [
      `https://www.youtube.com/watch?v=nb38-7g8rE8&list=RDnb38-7g8rE8&start_radio=1`,
      "https://www.youtube.com/watch?v=xIOIx7cb69E",
      "https://www.youtube.com/watch?v=8Px6vlwbAkU",
    ];
    for (let i = 0; i < tests.length; i++) {
      const res = await getVideoDetails(tests[i]);
      expect(res.hasOwnProperty("videoUrl")).toEqual(true);
      expect(res.hasOwnProperty("videoTitle")).toEqual(true);

      return Promise.resolve();
    }
  });
});
