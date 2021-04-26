import { testApiHandler } from "next-test-api-route-handler";
import factory from "./../src";

describe("smoke test basic routing", () => {
  const { getApp, router } = factory();

  test("GET handler is invoked", async (done) => {
    const handler = router().get(async (ctx) => {
      ctx.res.json({
        message: "ok",
      });
    });

    testApiHandler({
      requestPatcher: (req) => (req.url = "/api/test"),
      handler: { default: handler } as any,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const body = await res.json();

        expect(body).toEqual({ message: "ok" });
        expect(res.status).toBe(200);

        done();
      },
    });
  });

  test("POST handler is invoked with data", async (done) => {
    const POST_DATA = { abc: "xyz" };

    const handler = router().post(async (ctx) => {
      expect(ctx.req.body).toEqual(POST_DATA);

      ctx.res.json({
        message: "ok",
        data: ctx.req.body,
      });
    });

    testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(POST_DATA),
        });

        const body = await res.json();

        expect(body).toEqual({
          message: "ok",
          data: POST_DATA,
        });

        done();
      },
    });
  });
});
