import type { Role } from "@prisma/client";

export type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
};

export type JwtAccessPayload = {
  sub: string;
  email: string;
  role: Role;
};
