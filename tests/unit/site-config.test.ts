import { siteConfig } from "@/config/site";

describe("siteConfig", () => {
  it("exposes a valid local development url by default", () => {
    expect(siteConfig.url).toBeDefined();
    expect(siteConfig.url.startsWith("http")).toBe(true);
  });

  it("keeps the application identity stable", () => {
    expect(siteConfig.name).toBe("CampusPulse");
    expect(siteConfig.shortName).toBe("CampusPulse");
  });
});
