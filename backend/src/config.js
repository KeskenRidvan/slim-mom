import dotenv from "dotenv";

dotenv.config();

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function splitOrigins(value) {
  return String(value || "")
    .split(",")
    .map((item) => normalizeUrl(item))
    .filter(Boolean);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildOriginPattern(origin) {
  const normalizedOrigin = normalizeUrl(origin);

  if (!normalizedOrigin.includes("*")) {
    return normalizedOrigin;
  }

  const pattern = `^${escapeRegExp(normalizedOrigin).replace(/\\\*/g, ".*")}$`;
  return new RegExp(pattern);
}

const frontendUrl = normalizeUrl(process.env.FRONTEND_URL || "http://localhost:5173");
const corsOrigins = splitOrigins(process.env.CORS_ORIGINS)
  .filter((origin, index, list) => list.indexOf(origin) === index)
  .map(buildOriginPattern);

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  frontendUrl,
  serverPublicUrl: normalizeUrl(
    process.env.SERVER_PUBLIC_URL || `http://localhost:${process.env.PORT || 4000}`
  ),
  corsOrigins: corsOrigins.length > 0 ? corsOrigins : [frontendUrl],
};
