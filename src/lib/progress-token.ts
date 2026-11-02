import jwt from "jsonwebtoken";
import { env } from "../config/env";

/**
 * Progress token: JWT berumur pendek yang mengizinkan editor (scratch-gui / editor Python)
 * menyimpan progress SATU task untuk SATU siswa, tanpa memegang access token user.
 *
 * Ditandatangani dengan secret turunan supaya token ini TIDAK PERNAH lolos
 * sebagai access token di middleware `authenticate`, dan sebaliknya.
 */
const PROGRESS_SECRET = `${env.JWT_ACCESS_SECRET}:progress-v1`;
const AUDIENCE = "student-topic-progress";

export type ProgressTokenPayload = {
  /** studentProfile.id */
  sid: string;
  /** topicTask.code */
  task: string;
};

export function signProgressToken(payload: ProgressTokenPayload): { token: string; expiresIn: number } {
  const expiresIn = env.PROGRESS_TOKEN_TTL_HOURS * 3600;
  const token = jwt.sign(payload, PROGRESS_SECRET, { expiresIn, audience: AUDIENCE });
  return { token, expiresIn };
}

/** Return payload bila valid, null bila tidak valid / kedaluwarsa. */
export function verifyProgressToken(token: string): ProgressTokenPayload | null {
  try {
    const decoded = jwt.verify(token, PROGRESS_SECRET, { audience: AUDIENCE }) as jwt.JwtPayload &
      Partial<ProgressTokenPayload>;
    if (typeof decoded.sid !== "string" || typeof decoded.task !== "string") return null;
    return { sid: decoded.sid, task: decoded.task };
  } catch {
    return null;
  }
}
