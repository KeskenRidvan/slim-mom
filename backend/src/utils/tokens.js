import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export function generateTokens(userId, sessionId) {
  const accessToken = jwt.sign(
    { uid: userId, sid: sessionId },
    process.env.ACCESS_TOKEN_SECRET || "access-secret-change-me",
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" },
  );

  const refreshToken = uuidv4();

  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 14);

  return { accessToken, refreshToken, refreshExpiresAt };
}
