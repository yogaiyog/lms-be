import type { Role } from "./enums";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
