"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = require("node:crypto");
const env_1 = require("../../config/env");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
const auth_utils_1 = require("./auth.utils");
const auth_errors_1 = require("./auth.errors");
const email_service_1 = require("../../services/email.service");
const passwordSaltRounds = 12;
function sanitizeUser(user) {
    const { password: _password, emailVerificationToken: _evt, emailVerificationTokenExpiresAt: _evta, passwordResetToken: _prt, passwordResetTokenExpiresAt: _prta, ...rest } = user;
    return rest;
}
function signAccessToken(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, {
        expiresIn: `${env_1.env.ACCESS_TOKEN_TTL_MINUTES}m`,
    });
    return {
        accessToken,
        expiresIn: env_1.env.ACCESS_TOKEN_TTL_MINUTES * 60,
    };
}
async function createRefreshToken(userId, meta = {}, familyId) {
    const refreshToken = (0, auth_utils_1.generateOpaqueToken)();
    const tokenHash = (0, auth_utils_1.hashToken)(refreshToken);
    const session = await prisma_1.prisma.refreshToken.create({
        data: {
            userId,
            familyId: familyId ?? (0, node_crypto_1.randomUUID)(),
            tokenHash,
            userAgent: meta.userAgent,
            ipAddress: meta.ipAddress,
            deviceId: meta.deviceId,
            deviceName: meta.deviceName,
            expiresAt: new Date(Date.now() + env_1.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
        },
    });
    return { refreshToken, session };
}
async function ensureEmailAvailable(email) {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: { id: true },
    });
    if (existingUser) {
        throw new app_error_1.AppError("Email already registered", 409, "EMAIL_ALREADY_REGISTERED");
    }
}
async function ensureParentProfileExists(parentId) {
    const parent = await prisma_1.prisma.parentProfile.findUnique({
        where: { id: parentId },
        select: { id: true },
    });
    if (!parent) {
        throw new app_error_1.AppError("Parent profile not found", 404, "PARENT_NOT_FOUND");
    }
}
async function buildAuthResponse(user, meta = {}, familyId, include) {
    const access = signAccessToken(user);
    const refresh = await createRefreshToken(user.id, meta, familyId);
    const fullUser = await prisma_1.prisma.user.findUnique({
        where: { id: user.id },
        include: include ?? {
            parentProfile: true,
            tutorProfile: true,
            studentProfile: true,
        },
    });
    if (!fullUser) {
        throw new app_error_1.AppError("User not found", 404);
    }
    return {
        user: sanitizeUser(fullUser),
        ...access,
        refreshToken: refresh.refreshToken,
        tokenType: "Bearer",
    };
}
async function createAuthForExistingUser(user, meta = {}) {
    return buildAuthResponse(user, meta);
}
exports.authService = {
    async registerParent(input, meta = {}) {
        await ensureEmailAvailable(input.email);
        const hashedPassword = await bcryptjs_1.default.hash(input.password, passwordSaltRounds);
        const verificationToken = (0, node_crypto_1.randomBytes)(32).toString("hex");
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                password: hashedPassword,
                role: "PARENT",
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpiresAt: verificationTokenExpiresAt,
                parentProfile: {
                    create: {
                        fullName: input.fullName,
                        phone: input.phone ?? "",
                    },
                },
            },
        });
        email_service_1.emailService.sendVerificationEmail(user.email, verificationToken).catch(() => { });
        return buildAuthResponse(user, meta);
    },
    async registerTutor(input, meta = {}) {
        await ensureEmailAvailable(input.email);
        const hashedPassword = await bcryptjs_1.default.hash(input.password, passwordSaltRounds);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                password: hashedPassword,
                role: "TUTOR",
                emailVerified: true,
                tutorProfile: {
                    create: {
                        fullName: input.fullName,
                        phone: input.phone ?? "",
                        bio: input.bio,
                        avatarUrl: input.avatarUrl,
                        meetLink: input.meetLink,
                    },
                },
            },
        });
        return buildAuthResponse(user, meta);
    },
    async registerParentByAdmin(input, meta = {}) {
        await ensureEmailAvailable(input.email);
        const hashedPassword = await bcryptjs_1.default.hash(input.password, passwordSaltRounds);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                password: hashedPassword,
                role: "PARENT",
                emailVerified: true,
                parentProfile: {
                    create: {
                        fullName: input.fullName,
                        phone: input.phone ?? "",
                    },
                },
            },
        });
        return buildAuthResponse(user, meta);
    },
    async registerStudent(input, meta = {}) {
        await ensureEmailAvailable(input.email);
        await ensureParentProfileExists(input.parentId);
        const hashedPassword = await bcryptjs_1.default.hash(input.password, passwordSaltRounds);
        const categoryName = input.categoryId
            ? undefined
            : input.category === "JUNIOR_I" ? "Kelas 1"
                : input.category === "JUNIOR_II" ? "Kelas 4"
                    : input.category === "JUNIOR_III" ? "Kelas 7"
                        : undefined;
        const categoryId = input.categoryId ?? (categoryName
            ? (await prisma_1.prisma.category.findUnique({ where: { name: categoryName } }))?.id
            : undefined);
        const verificationToken = (0, node_crypto_1.randomBytes)(32).toString("hex");
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                password: hashedPassword,
                role: "STUDENT",
                emailVerified: true,
                studentProfile: {
                    create: {
                        parentId: input.parentId,
                        fullName: input.fullName,
                        nickname: input.nickname,
                        birthDate: input.birthDate,
                        avatarUrl: input.avatarUrl,
                        categoryId: categoryId,
                        school: input.school,
                    },
                },
            },
        });
        return buildAuthResponse(user, meta);
    },
    async login(input, meta = {}) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
            include: {
                parentProfile: true,
                tutorProfile: true,
                studentProfile: true,
            },
        });
        if (!user) {
            throw (0, auth_errors_1.unauthorized)("Email atau password salah");
        }
        const isValid = await bcryptjs_1.default.compare(input.password, user.password);
        if (!isValid) {
            throw (0, auth_errors_1.unauthorized)("Email atau password salah");
        }
        if (!user.emailVerified) {
            throw new app_error_1.AppError("Email belum diverifikasi. Silakan cek inbox/spam email kamu untuk verifikasi.", 403, "EMAIL_NOT_VERIFIED");
        }
        return createAuthForExistingUser({ id: user.id, email: user.email, role: user.role }, meta);
    },
    async refresh(input, meta = {}) {
        const tokenHash = (0, auth_utils_1.hashToken)(input.refreshToken);
        const session = await prisma_1.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: {
                user: {
                    include: {
                        parentProfile: true,
                        tutorProfile: true,
                        studentProfile: true,
                    },
                },
            },
        });
        if (!session) {
            throw (0, auth_errors_1.unauthorized)("Refresh token invalid");
        }
        if (session.revokedAt) {
            await prisma_1.prisma.refreshToken.updateMany({
                where: {
                    familyId: session.familyId,
                },
                data: {
                    revokedAt: new Date(),
                },
            });
            throw (0, auth_errors_1.unauthorized)("Refresh token sudah tidak valid");
        }
        if (session.expiresAt <= new Date()) {
            await prisma_1.prisma.refreshToken.update({
                where: { id: session.id },
                data: { revokedAt: new Date() },
            });
            throw (0, auth_errors_1.unauthorized)("Refresh token kedaluwarsa");
        }
        const [access, newSession] = await prisma_1.prisma.$transaction(async (tx) => {
            const nextRefresh = (0, auth_utils_1.generateOpaqueToken)();
            const nextHash = (0, auth_utils_1.hashToken)(nextRefresh);
            await tx.refreshToken.update({
                where: { id: session.id },
                data: {
                    revokedAt: new Date(),
                    lastUsedAt: new Date(),
                },
            });
            const created = await tx.refreshToken.create({
                data: {
                    userId: session.userId,
                    familyId: session.familyId,
                    tokenHash: nextHash,
                    userAgent: meta.userAgent ?? session.userAgent,
                    ipAddress: meta.ipAddress ?? session.ipAddress,
                    deviceId: meta.deviceId ?? session.deviceId,
                    deviceName: meta.deviceName ?? session.deviceName,
                    expiresAt: new Date(Date.now() + env_1.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
                },
            });
            const signed = signAccessToken({
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
            });
            return [
                signed,
                {
                    refreshToken: nextRefresh,
                    session: created,
                },
            ];
        });
        return {
            user: sanitizeUser(session.user),
            ...access,
            refreshToken: newSession.refreshToken,
            tokenType: "Bearer",
        };
    },
    async logout(refreshToken) {
        const tokenHash = (0, auth_utils_1.hashToken)(refreshToken);
        const session = await prisma_1.prisma.refreshToken.findUnique({
            where: { tokenHash },
        });
        if (!session) {
            return { success: true };
        }
        await prisma_1.prisma.refreshToken.update({
            where: { id: session.id },
            data: { revokedAt: new Date(), lastUsedAt: new Date() },
        });
        return { success: true };
    },
    async logoutAll(userId) {
        await prisma_1.prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
        return { success: true };
    },
    async impersonate(userId, meta = {}) {
        const target = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true },
        });
        if (!target)
            throw new app_error_1.AppError("User not found", 404);
        if (target.role !== "STUDENT")
            throw new app_error_1.AppError("Hanya bisa impersonate student", 403);
        return createAuthForExistingUser({ id: target.id, email: target.email, role: target.role }, meta);
    },
    async me(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                parentProfile: true,
                tutorProfile: true,
                studentProfile: true,
            },
        });
        if (!user) {
            throw (0, auth_errors_1.unauthorized)("User not found");
        }
        return sanitizeUser(user);
    },
    async forgotPassword(input) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (!user) {
            return { success: true };
        }
        const resetToken = (0, node_crypto_1.randomBytes)(32).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetTokenExpiresAt: resetTokenExpiresAt,
            },
        });
        email_service_1.emailService.sendResetPasswordEmail(user.email, resetToken).catch(() => { });
        return { success: true };
    },
    async resetPassword(input) {
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                passwordResetToken: input.token,
                passwordResetTokenExpiresAt: { gt: new Date() },
            },
        });
        if (!user) {
            throw new app_error_1.AppError("Token reset password tidak valid atau sudah kedaluwarsa", 400, "INVALID_RESET_TOKEN");
        }
        const hashedPassword = await bcryptjs_1.default.hash(input.password, passwordSaltRounds);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetTokenExpiresAt: null,
            },
        });
        return { success: true };
    },
    async verifyEmail(input) {
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                emailVerificationToken: input.token,
                emailVerificationTokenExpiresAt: { gt: new Date() },
            },
        });
        if (!user) {
            throw new app_error_1.AppError("Token verifikasi tidak valid atau sudah kedaluwarsa", 400, "INVALID_VERIFICATION_TOKEN");
        }
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpiresAt: null,
            },
        });
        return { success: true, message: "Email berhasil diverifikasi" };
    },
    async resendVerification(input) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: input.email.toLowerCase() },
        });
        if (!user) {
            throw new app_error_1.AppError("Email tidak ditemukan", 404, "EMAIL_NOT_FOUND");
        }
        if (user.emailVerified) {
            throw new app_error_1.AppError("Email sudah diverifikasi", 400, "ALREADY_VERIFIED");
        }
        const verificationToken = (0, node_crypto_1.randomBytes)(32).toString("hex");
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpiresAt: verificationTokenExpiresAt,
            },
        });
        email_service_1.emailService.sendVerificationEmail(user.email, verificationToken).catch(() => { });
        return { success: true, message: "Email verifikasi telah dikirim ulang" };
    },
};
