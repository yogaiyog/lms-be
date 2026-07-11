"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = unauthorized;
exports.forbidden = forbidden;
const app_error_1 = require("../../utils/app-error");
function unauthorized(message = "Unauthorized") {
    return new app_error_1.AppError(message, 401, "UNAUTHORIZED");
}
function forbidden(message = "Forbidden") {
    return new app_error_1.AppError(message, 403, "FORBIDDEN");
}
