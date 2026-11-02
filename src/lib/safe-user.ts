/**
 * Kolom User yang aman dikirim ke client.
 * Jangan pernah pakai `include: { user: true }` — itu ikut mengirim hash password,
 * passwordResetToken, dan emailVerificationToken.
 */
export const safeUserSelect = {
  id: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const safeUserInclude = { select: safeUserSelect } as const;
