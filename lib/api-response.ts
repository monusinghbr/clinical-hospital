import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AppError } from "@/lib/errors";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    issues?: unknown;
  };
};

export function ok<T>(data: T, meta?: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data, meta }, init);
}

export function fail(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json<ApiFailure>(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The submitted data is invalid",
          issues: error.issues,
        },
      },
      { status: 422 },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json<ApiFailure>(
      { ok: false, error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  return NextResponse.json<ApiFailure>(
    { ok: false, error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } },
    { status: 500 },
  );
}
