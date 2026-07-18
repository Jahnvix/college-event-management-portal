import { registerStudentSchema } from "@/server/auth/validation";

describe("registerStudentSchema", () => {
  it("normalizes valid registration input", () => {
    const parsed = registerStudentSchema.parse({
      email: "Student@Example.com",
      name: "Student User",
      password: "Campus123",
      yearOfStudy: "2",
    });

    expect(parsed.email).toBe("student@example.com");
    expect(parsed.yearOfStudy).toBe(2);
  });

  it("rejects weak passwords", () => {
    const result = registerStudentSchema.safeParse({
      email: "student@example.com",
      name: "Student User",
      password: "password",
    });

    expect(result.success).toBe(false);
  });
});
