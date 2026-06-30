import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { unauthorized, forbidden } from "./auth.errors";
import type { JwtAccessPayload } from "./auth.types";
import { Role } from "@prisma/client";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization");

  if (!header?.startsWith("Bearer ")) {
    return next(unauthorized("Token akses tidak ditemukan"));
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtAccessPayload;

    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch {
    return next(unauthorized("Token akses tidak valid"));
  }
}

export function requireRole(...allowed: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(unauthorized());
    }

    if (!allowed.includes(req.auth.role)) {
      return next(forbidden("Role tidak memiliki akses"));
    }

    return next();
  };
}
