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

authRouter.get("/check-email", async (req, res, next) => {
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

authRouter.post("/forgot-password", async (req, res, next) => {
  try {
    const payload = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/reset-password", async (req, res, next) => {
  try {
    const payload = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/verify-email", async (req, res, next) => {
  try {
    const payload = verifyEmailSchema.parse(req.body);
    const result = await authService.verifyEmail(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

authRouter.post("/resend-verification", async (req, res, next) => {
  try {
    const payload = forgotPasswordSchema.parse(req.body);
    const result = await authService.resendVerification(payload);
    return res.json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});
