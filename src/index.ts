import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { logger } from "./utils/logger";
import { queue } from "./utils/queue";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API endpoint to check server health
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API endpoint to start a task
app.post("/api/tasks/start", async (req: Request, res: Response) => {
  try {
    const { fid } = req.body;

    if (typeof fid !== "number") {
      return res.status(400).json({ message: "fid must be a number" });
    }

    logger.info(`[API] Starting task for FID: ${fid}`);

    // Add task to queue
    const { task, existing } = await queue.addTask(fid);

    if (existing) {
      return res
        .status(409)
        .json({ message: `Task for FID ${fid} already exists` });
    }

    return res.json({ task: task });
  } catch (error) {
    logger.error("[API] Error starting task:", error);
    return res.status(500).json({ message: "Failed to start task" });
  }
});

// API endpoint to get task by FID
app.get("/api/tasks/:fid", async (req: Request, res: Response) => {
  try {
    const { fid } = req.params;

    if (!fid) {
      return res.status(400).json({ message: "fid parameter is required" });
    }

    const fidInt = parseInt(fid);
    if (isNaN(fidInt)) {
      return res.status(400).json({ message: "fid must be a number" });
    }

    const task = await queue.getTask(fidInt);

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with FID ${fidInt} does not exist` });
    }

    return res.json({ task: task });
  } catch (error) {
    logger.error("[API] Error getting task:", error);
    return res.status(500).json({ message: "Failed to get task" });
  }
});

// Start the server
async function startServer() {
  try {
    // Initialize the task queue (recover incomplete tasks from MongoDB)
    await queue.initialize();

    // Start listening for incoming requests
    app.listen(PORT, () => {
      logger.info(`[Server] is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("[Server] Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
