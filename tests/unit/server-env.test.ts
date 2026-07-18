import { getServerEnv } from "@/server/env";

describe("getServerEnv", () => {
  it("accepts mongodb+srv connection strings", () => {
    const env = getServerEnv({
      AUTH_SECRET: "test-auth-secret-value",
      DATABASE_URL:
        "mongodb+srv://user:password@cluster0.example.mongodb.net/campuspulse?retryWrites=true&w=majority",
    });

    expect(env.DATABASE_URL).toContain("mongodb+srv://");
  });

  it("rejects unsupported datasource schemes", () => {
    expect(() =>
      getServerEnv({
        AUTH_SECRET: "test-auth-secret-value",
        DATABASE_URL: "postgresql://localhost:5432/campuspulse",
      }),
    ).toThrow("DATABASE_URL");
  });
});
