"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const auth_errors_1 = require("./auth.errors");
function authenticate(req, _res, next) {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer ")) {
        return next((0, auth_errors_1.unauthorized)("Token akses tidak ditemukan"));
    }
    const token = header.slice("Bearer ".length).trim();
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        req.auth = {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        return next();
    }
    catch {
        return next((0, auth_errors_1.unauthorized)("Token akses tidak valid"));
    }
}
function requireRole(...allowed) {
    return (req, _res, next) => {
        if (!req.auth) {
            return next((0, auth_errors_1.unauthorized)());
        }
        if (!allowed.includes(req.auth.role)) {
            return next((0, auth_errors_1.forbidden)("Role tidak memiliki akses"));
        }
        return next();
    };
}
