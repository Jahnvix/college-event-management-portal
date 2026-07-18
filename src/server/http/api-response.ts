import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data, ok: true }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: { message }, ok: false }, { status });
}

export function validationError(error: ZodError) {
  return NextResponse.json(
    {
      error: {
        issues: error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        })),
        message: "Request validation failed.",
      },
      ok: false,
    },
    { status: 422 },
  );
}
