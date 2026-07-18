import {
  checkRateLimit,
  resetRateLimitForTests,
} from "@/server/auth/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitForTests();
  });

  it("blocks requests after the configured limit", () => {
    const options = { limit: 2, windowMs: 60_000 };

    expect(checkRateLimit("key", options).allowed).toBe(true);
    expect(checkRateLimit("key", options).allowed).toBe(true);
    expect(checkRateLimit("key", options).allowed).toBe(false);
  });
});
