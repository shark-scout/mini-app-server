import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { logger } from "./utils/logger";
import { processTask } from "./utils/tasks";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API endpoint to check server health
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API endpoint to start a task
app.post("/api/tasks/start", async (req: Request, res: Response) => {
  try {
    const { fid } = req.body;

    if (typeof fid !== "number") {
      return res.status(400).json({
        error: "Invalid request",
        message: "fid must be a number",
      });
    }

    logger.info(`[API] Starting task for FID: ${fid}`);

    // Start the task (this runs asynchronously)
    processTask(fid).catch((error) => {
      logger.error(`[API] Task failed for FID ${fid}:`, error);
    });

    return res.json({
      success: true,
      message: `Task started for FID: ${fid}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("[API] Error starting task:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to start task",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Start task: POST http://localhost:${PORT}/api/tasks/start`);
});
