import { AppError } from "../../utils/app-error";

export function unauthorized(message = "Unauthorized") {
  return new AppError(message, 401, "UNAUTHORIZED");
}

export function forbidden(message = "Forbidden") {
  return new AppError(message, 403, "FORBIDDEN");
}
