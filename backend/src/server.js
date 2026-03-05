import "dotenv/config";
import cors from "cors";
import express from "express";
import { appConfig } from "./config.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";

const app = express();

app.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/],
    credentials: false,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "tyre-monitoring-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", dashboardRoutes);

app.use((error, req, res, next) => {
  const message = error?.message || "Internal server error";
  const safeMessage =
    message.includes("Invalid object name") || message.includes("Could not find")
      ? "View/table belum tersedia di database. Jalankan script SQL view terlebih dahulu."
      : message;

  console.error("[api:error]", message);
  res.status(500).json({ message: safeMessage });
});

app.listen(appConfig.port, () => {
  console.log(`[api] listening on port ${appConfig.port}`);
});

