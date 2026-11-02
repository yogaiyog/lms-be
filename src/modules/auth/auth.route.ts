import { Router } from "express";
import { Role } from "../../types/enums";
import { authService } from "./auth.service";
import { trialService } from "./trial.service";
import {
  loginSchema,
  logoutSchema,
  parentRegisterSchema,
  refreshSchema,
  studentRegisterSchema,
  tutorRegisterSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.schemas";
import { trialRegisterSchema } from "./trial.schema";
import { authenticate, requireRole } from "./auth.middleware";
import { prisma } from "../../lib/prisma";


import { rateLimit } from "../../middlewares/rate-limit.middleware";

const MIN = 60 * 1000;
const bodyEmail = (req: { body?: { email?: unknown } }) =>
  typeof req.body?.email === "string" ? req.body.email : undefined;

// Satu kelas bisa login dari satu IP (NAT sekolah) → limit per-IP dibuat longgar,
// limit per-IP+email dibuat ketat untuk mencegah brute force.
const loginPerEmail = rateLimit({ name: "login-email", windowMs: 15 * MIN, max: 10, keyExtra: bodyEmail });
const loginPerIp = rateLimit({ name: "login-ip", windowMs: 15 * MIN, max: 100 });
const registerLimit = rateLimit({ name: "register", windowMs: 60 * MIN, max: 20 });
const refreshLimit = rateLimit({ name: "refresh", windowMs: 15 * MIN, max: 300 });
const checkEmailLimit = rateLimit({ name: "check-email", windowMs: 15 * MIN, max: 30 });
const forgotPerEmail = rateLimit({ name: "forgot-email", windowMs: 15 * MIN, max: 3, keyExtra: bodyEmail });
const forgotPerIp = rateLimit({ name: "forgot-ip", windowMs: 60 * MIN, max: 20 });
const resetLimit = rateLimit({ name: "reset-password", windowMs: 15 * MIN, max: 10 });
const verifyLimit = rateLimit({ name: "verify-email", windowMs: 15 * MIN, max: 20 });
const resendPerEmail = rateLimit({ name: "resend-email", windowMs: 15 * MIN, max: 3, keyExtra: bodyEmail });

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

authRouter.post("/register", registerLimit, async (req, res, next) => {
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
  "/register/parent",
  authenticate,
  requireRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const payload = parentRegisterSchema.parse(req.body);
      const result = await authService.registerParentByAdmin(payload, requestMeta(req));
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

authRouter.post(
  "/register/trial",
  authenticate,
  requireRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const payload = trialRegisterSchema.parse(req.body);
      const result = await trialService.registerTrial(payload);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  },
);

authRouter.post("/login", loginPerIp, loginPerEmail, async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await authService.login(payload, requestMeta(req));
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/refresh", refreshLimit, async (req, res, next) => {
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

authRouter.post(
  "/impersonate",
  authenticate,
  requireRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const { userId } = req.body as { userId: string };
      if (!userId) {
        return res.status(400).json({ success: false, message: "userId is required" });
      }
      const result = await authService.impersonate(userId, requestMeta(req));
      return res.json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  },
);

authRouter.get("/check-email", checkEmailLimit, async (req, res, next) => {
  try {
    const email = req.query.email as string | undefined;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    return res.json({ success: true, data: { available: !user } });
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

authRouter.post("/forgot-password", forgotPerIp, forgotPerEmail, async (req, res, next) => {
  try {
    const payload = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/reset-password", resetLimit, async (req, res, next) => {
  try {
    const payload = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/verify-email", verifyLimit, async (req, res, next) => {
  try {
    const payload = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/resend-verification", resendPerEmail, async (req, res, next) => {
  try {
    const payload = forgotPasswordSchema.parse(req.body);
    const result = await authService.resendVerification(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});
