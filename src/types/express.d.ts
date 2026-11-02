import type { Role } from "./enums";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: Role;
      };
      /** Batas data yang boleh dilihat user non-admin (diisi middleware scoping). */
      scope?: {
        parentId?: string;
        studentId?: string;
      };
    }
  }
}

export {};
