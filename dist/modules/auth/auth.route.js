"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const enums_1 = require("../../types/enums");
const auth_service_1 = require("./auth.service");
const auth_schemas_1 = require("./auth.schemas");
const auth_middleware_1 = require("./auth.middleware");
const prisma_1 = require("../../lib/prisma");
exports.authRouter = (0, express_1.Router)();
function requestMeta(req) {
    return {
        userAgent: req.get("user-agent") ?? undefined,
        ipAddress: req.ip,
        deviceId: typeof req.body.deviceId === "string" ? req.body.deviceId : undefined,
        deviceName: typeof req.body.deviceName === "string" ? req.body.deviceName : undefined,
    };
}
exports.authRouter.post("/register", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.parentRegisterSchema.parse(req.body);
        const result = await auth_service_1.authService.registerParent(payload, requestMeta(req));
        return res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/register/tutor", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const payload = auth_schemas_1.tutorRegisterSchema.parse(req.body);
        const result = await auth_service_1.authService.registerTutor(payload, requestMeta(req));
        return res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/register/parent", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const payload = auth_schemas_1.parentRegisterSchema.parse(req.body);
        const result = await auth_service_1.authService.registerParentByAdmin(payload, requestMeta(req));
        return res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/register/student", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.PARENT, enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const payload = auth_schemas_1.studentRegisterSchema.parse(req.body);
        const result = await auth_service_1.authService.registerStudent(payload, requestMeta(req));
        return res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/login", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.loginSchema.parse(req.body);
        const result = await auth_service_1.authService.login(payload, requestMeta(req));
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/refresh", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.refreshSchema.parse(req.body);
        const result = await auth_service_1.authService.refresh(payload, requestMeta(req));
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/logout", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.logoutSchema.parse(req.body);
        if (!payload.refreshToken) {
            return res.status(200).json({ success: true, data: { success: true } });
        }
        const result = await auth_service_1.authService.logout(payload.refreshToken);
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/logout-all", auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        if (!req.auth) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = await auth_service_1.authService.logoutAll(req.auth.userId);
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/impersonate", auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(enums_1.Role.ADMIN), async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }
        const result = await auth_service_1.authService.impersonate(userId, requestMeta(req));
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.get("/check-email", async (req, res, next) => {
    try {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        return res.json({ success: true, data: { available: !user } });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.get("/me", auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        if (!req.auth) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = await auth_service_1.authService.me(req.auth.userId);
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/forgot-password", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.forgotPasswordSchema.parse(req.body);
        const result = await auth_service_1.authService.forgotPassword(payload);
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/reset-password", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.resetPasswordSchema.parse(req.body);
        const result = await auth_service_1.authService.resetPassword(payload);
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/verify-email", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.verifyEmailSchema.parse(req.body);
        const result = await auth_service_1.authService.verifyEmail(payload);
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter.post("/resend-verification", async (req, res, next) => {
    try {
        const payload = auth_schemas_1.forgotPasswordSchema.parse(req.body);
        const result = await auth_service_1.authService.resendVerification(payload);
        return res.json({ success: true, data: result });
    }
    catch (error) {
        return next(error);
    }
});
