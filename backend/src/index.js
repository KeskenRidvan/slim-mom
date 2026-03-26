import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import dailyRouter from "./routes/daily.routes.js";
import diaryRouter from "./routes/diary.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { openApiSpec } from "./docs/swagger.js";
import { config } from "./config.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../../frontend/dist");
const hasFrontendBuild = fs.existsSync(distPath);

function isAllowedOrigin(origin) {
  return config.corsOrigins.some((allowedOrigin) => {
    if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }

    return allowedOrigin === origin;
  });
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || config.nodeEnv !== "production") {
      callback(null, true);
      return;
    }

    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", dailyRouter);
app.use("/api", diaryRouter);
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup({
    ...openApiSpec,
    servers: [{ url: `${config.serverPublicUrl}/api` }],
  })
);

if (hasFrontendBuild) {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(config.port);
