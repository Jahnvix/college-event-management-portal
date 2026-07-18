import { hashPassword, verifyPassword } from "@/server/auth/password";

describe("password service", () => {
  it("hashes and verifies passwords", async () => {
    const hash = await hashPassword("Campus123");

    expect(hash).not.toBe("Campus123");
    await expect(verifyPassword("Campus123", hash)).resolves.toBe(true);
    await expect(verifyPassword("Wrong123", hash)).resolves.toBe(false);
  });
});
