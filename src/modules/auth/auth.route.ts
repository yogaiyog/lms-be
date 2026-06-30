import { Router } from "express";
import { Role } from "../../types/enums";
import { authService } from "./auth.service";
import {
  loginSchema,
  logoutSchema,
  parentRegisterSchema,
  refreshSchema,
  studentRegisterSchema,
  tutorRegisterSchema,
} from "./auth.schemas";
import { authenticate, requireRole } from "./auth.middleware";

export const authRouter = Router();

function requestMeta(req: import("express").Request) {
  return {
    userAgent: req.get("user-agent") ?? undefined,
    ipAddress: req.ip,
    deviceId: typeof req.body.deviceId === "string" ? req.body.deviceId : undefined,
    deviceName:
      typeof req.body.deviceName === "string" ? req.body.deviceName : undefined,
  };
}

authRouter.post("/register", async (req, res, next) => {
  try {
    const payload = parentRegisterSchema.parse(req.body);
    const result = await authService.registerParent(payload, requestMeta(req));
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post(
  "/register/tutor",
  authenticate,
  requireRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const payload = tutorRegisterSchema.parse(req.body);
      const result = await authService.registerTutor(payload, requestMeta(req));
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  },
);

authRouter.post(
  "/register/student",
  authenticate,
  requireRole(Role.PARENT, Role.ADMIN),
  async (req, res, next) => {
    try {
      const payload = studentRegisterSchema.parse(req.body);
      const result = await authService.registerStudent(payload, requestMeta(req));
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  },
);

authRouter.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload, requestMeta(req));
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const payload = refreshSchema.parse(req.body);
    const result = await authService.refresh(payload, requestMeta(req));
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    const payload = logoutSchema.parse(req.body);
    if (!payload.refreshToken) {
      return res.status(200).json({ success: true, data: { success: true } });
    }

    const result = await authService.logout(payload.refreshToken);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/logout-all", authenticate, async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await authService.logoutAll(req.auth.userId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.get("/me", authenticate, async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await authService.me(req.auth.userId);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});
