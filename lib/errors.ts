export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
    public readonly code = "APP_ERROR",
  ) {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "FORBIDDEN");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication is required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ValidationError extends AppError {
  constructor(message = "The submitted data is invalid") {
    super(message, 422, "VALIDATION_ERROR");
  }
}
