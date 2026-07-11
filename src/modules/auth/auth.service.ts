import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { randomUUID, randomBytes } from "node:crypto";
import { Category, Role } from "../../types/enums";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { generateOpaqueToken, hashToken } from "./auth.utils";
import type { AuthTokenPair, JwtAccessPayload } from "./auth.types";
import { unauthorized } from "./auth.errors";
import { emailService } from "../../services/email.service";

type RequestMeta = {
  userAgent?: string;
  ipAddress?: string;
  deviceId?: string;
  deviceName?: string;
};

type PublicUser = Omit<User, "password"> & {
  parentProfile: unknown | null;
  tutorProfile: unknown | null;
  studentProfile: unknown | null;
};

type RegisterParentInput = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
};

type RegisterTutorInput = RegisterParentInput & {
  bio?: string | null;
  avatarUrl?: string | null;
  meetLink?: string | null;
};

type RegisterStudentInput = RegisterParentInput & {
  parentId: string;
  nickname: string;
  birthDate: Date;
  avatarUrl?: string | null;
  category?: Category;
  categoryId?: string | null;
};

type LoginInput = {
  email: string;
  password: string;
};

type RefreshInput = {
  refreshToken: string;
};

const passwordSaltRounds = 12;

function sanitizeUser(user: User & Record<string, unknown>): PublicUser {
  const { password: _password, emailVerificationToken: _evt, emailVerificationTokenExpiresAt: _evta, passwordResetToken: _prt, passwordResetTokenExpiresAt: _prta, ...rest } = user;
  return rest as PublicUser;
}

function signAccessToken(user: Pick<User, "id" | "email" | "role">) {
  const payload: JwtAccessPayload = {
    sub: user.id,
    email: user.email,
    role: user.role as Role,
  };

  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m`,
  });

  return {
    accessToken,
    expiresIn: env.ACCESS_TOKEN_TTL_MINUTES * 60,
  };
}

async function createRefreshToken(
  userId: string,
  meta: RequestMeta = {},
  familyId?: string,
) {
  const refreshToken = generateOpaqueToken();
  const tokenHash = hashToken(refreshToken);

  const session = await prisma.refreshToken.create({
    data: {
      userId,
      familyId: familyId ?? randomUUID(),
      tokenHash,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      deviceId: meta.deviceId,
      deviceName: meta.deviceName,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { refreshToken, session };
}

async function ensureEmailAvailable(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("Email already registered", 409, "EMAIL_ALREADY_REGISTERED");
  }
}

async function ensureParentProfileExists(parentId: string) {
  const parent = await prisma.parentProfile.findUnique({
    where: { id: parentId },
    select: { id: true },
  });

  if (!parent) {
    throw new AppError("Parent profile not found", 404, "PARENT_NOT_FOUND");
  }
}

async function buildAuthResponse(
  user: Pick<User, "id" | "email" | "role">,
  meta: RequestMeta = {},
  familyId?: string,
  include?: Record<string, unknown>,
) {
  const access = signAccessToken(user);
  const refresh = await createRefreshToken(user.id, meta, familyId);

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: include ?? {
      parentProfile: true,
      tutorProfile: true,
      studentProfile: true,
    },
  });

  if (!fullUser) {
    throw new AppError("User not found", 404);
  }

  return {
    user: sanitizeUser(fullUser),
    ...access,
    refreshToken: refresh.refreshToken,
    tokenType: "Bearer" as const,
  } satisfies AuthTokenPair & { user: PublicUser };
}

async function createAuthForExistingUser(
  user: Pick<User, "id" | "email" | "role">,
  meta: RequestMeta = {},
) {
  return buildAuthResponse(user, meta);
}

export const authService = {
  async registerParent(input: RegisterParentInput, meta: RequestMeta = {}) {
    await ensureEmailAvailable(input.email);
    const hashedPassword = await bcrypt.hash(input.password, passwordSaltRounds);

    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
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

    emailService.sendVerificationEmail(user.email, verificationToken).catch(() => {});

    return buildAuthResponse(user, meta);
  },

  async registerTutor(input: RegisterTutorInput, meta: RequestMeta = {}) {
    await ensureEmailAvailable(input.email);
    const hashedPassword = await bcrypt.hash(input.password, passwordSaltRounds);

    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        password: hashedPassword,
        role: "TUTOR",
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiresAt: verificationTokenExpiresAt,
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

    emailService.sendVerificationEmail(user.email, verificationToken).catch(() => {});

    return buildAuthResponse(user, meta);
  },

  async registerStudent(input: RegisterStudentInput, meta: RequestMeta = {}) {
    await ensureEmailAvailable(input.email);
    await ensureParentProfileExists(input.parentId);
    const hashedPassword = await bcrypt.hash(input.password, passwordSaltRounds);

    const categoryName = input.categoryId
      ? undefined
      : input.category === "JUNIOR_I" ? "Kelas 1"
        : input.category === "JUNIOR_II" ? "Kelas 4"
          : input.category === "JUNIOR_III" ? "Kelas 7"
            : undefined;
    const categoryId = input.categoryId ?? (categoryName
      ? (await prisma.category.findUnique({ where: { name: categoryName } }))?.id
      : undefined);

    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
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
          },
        },
      },
    });

    return buildAuthResponse(user, meta);
  },

  async login(input: LoginInput, meta: RequestMeta = {}) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        parentProfile: true,
        tutorProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw unauthorized("Email atau password salah");
    }

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) {
      throw unauthorized("Email atau password salah");
    }

    if (!user.emailVerified) {
      throw new AppError(
        "Email belum diverifikasi. Silakan cek inbox/spam email kamu untuk verifikasi.",
        403,
        "EMAIL_NOT_VERIFIED",
      );
    }

    return createAuthForExistingUser(
      { id: user.id, email: user.email, role: user.role },
      meta,
    );
  },

  async refresh(input: RefreshInput, meta: RequestMeta = {}) {
    const tokenHash = hashToken(input.refreshToken);

    const session = await prisma.refreshToken.findUnique({
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
      throw unauthorized("Refresh token invalid");
    }

    if (session.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: {
          familyId: session.familyId,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      throw unauthorized("Refresh token sudah tidak valid");
    }

    if (session.expiresAt <= new Date()) {
      await prisma.refreshToken.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });

      throw unauthorized("Refresh token kedaluwarsa");
    }

    const [access, newSession] = await prisma.$transaction(async (tx) => {
      const nextRefresh = generateOpaqueToken();
      const nextHash = hashToken(nextRefresh);

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
          expiresAt: new Date(
            Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
          ),
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
      ] as const;
    });

    return {
      user: sanitizeUser(session.user),
      ...access,
      refreshToken: newSession.refreshToken,
      tokenType: "Bearer" as const,
    };
  },

  async logout(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);

    const session = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!session) {
      return { success: true };
    }

    await prisma.refreshToken.update({
      where: { id: session.id },
      data: { revokedAt: new Date(), lastUsedAt: new Date() },
    });

    return { success: true };
  },

  async logoutAll(userId: string) {
    await prisma.refreshToken.updateMany({
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

  async impersonate(userId: string, meta: RequestMeta = {}) {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });
    if (!target) throw new AppError("User not found", 404);
    if (target.role !== "STUDENT") throw new AppError("Hanya bisa impersonate student", 403);
    return createAuthForExistingUser(
      { id: target.id, email: target.email, role: target.role },
      meta,
    );
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        parentProfile: true,
        tutorProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw unauthorized("User not found");
    }

    return sanitizeUser(user);
  },

  async forgotPassword(input: { email: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      return { success: true };
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiresAt: resetTokenExpiresAt,
      },
    });

    emailService.sendResetPasswordEmail(user.email, resetToken).catch(() => {});

    return { success: true };
  },

  async resetPassword(input: { token: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: input.token,
        passwordResetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError("Token reset password tidak valid atau sudah kedaluwarsa", 400, "INVALID_RESET_TOKEN");
    }

    const hashedPassword = await bcrypt.hash(input.password, passwordSaltRounds);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    return { success: true };
  },

  async verifyEmail(input: { token: string }) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: input.token,
        emailVerificationTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError("Token verifikasi tidak valid atau sudah kedaluwarsa", 400, "INVALID_VERIFICATION_TOKEN");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
      },
    });

    return { success: true, message: "Email berhasil diverifikasi" };
  },

  async resendVerification(input: { email: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError("Email tidak ditemukan", 404, "EMAIL_NOT_FOUND");
    }

    if (user.emailVerified) {
      throw new AppError("Email sudah diverifikasi", 400, "ALREADY_VERIFIED");
    }

    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiresAt: verificationTokenExpiresAt,
      },
    });

    emailService.sendVerificationEmail(user.email, verificationToken).catch(() => {});

    return { success: true, message: "Email verifikasi telah dikirim ulang" };
  },
};
