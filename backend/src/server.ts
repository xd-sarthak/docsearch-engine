// ==========================
// Load env first
// ==========================
import dotenv from "dotenv";
dotenv.config();

// ==========================
// Imports
// ==========================
import { config } from "./config/index.js";
import { buildApp } from "./app.js";
import { prisma } from "./db/prisma.js";

// IMPORTANT: start workers before server boot
import "./workers/document.worker.js";

// ==========================
// Server Startup
// ==========================
const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      port: config.port,
      host: config.host,
    });
    console.log(`🚀 Server running at http://${config.host}:${config.port}`);
  } catch (err) {
    console.error("🔥 Failed to start server:", err);
    process.exit(1);
  }

  const shutdown = async (signal: string) => {
    console.log(`⚠️ Received ${signal} — shutting down...`);
    try {
      await app.close();
      console.log("🧹 Server closed cleanly.");
      process.exit(0);
    } catch (err) {
      console.error("❌ Shutdown error:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start();


