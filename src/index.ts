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

    // Add task to queue
    const task = await queue.addTask(fid);

    return res.json({
      success: true,
      message: `Task started for FID: ${fid}`,
      taskId: task._id,
      status: task.status,
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

// API endpoint to get task status
app.get("/api/tasks/:taskId", async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        error: "Invalid request",
        message: "taskId parameter is required",
      });
    }

    const task = await queue.getTask(taskId);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
        message: `Task with ID ${taskId} does not exist`,
      });
    }

    return res.json({
      success: true,
      task: {
        id: task._id,
        fid: task.fid,
        status: task.status,
        createdAt: task.createdAt,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
        progress: task.progress,
        result: task.result,
        error: task.error,
      },
    });
  } catch (error) {
    logger.error("[API] Error getting task:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to get task",
    });
  }
});

// API endpoint to list all tasks
app.get("/api/tasks", async (_req: Request, res: Response) => {
  try {
    const tasks = await queue.getTasks();
    const queueStatus = queue.getStatus();

    return res.json({
      success: true,
      queueStatus,
      tasks: tasks.map((task) => ({
        id: task._id,
        fid: task.fid,
        status: task.status,
        createdAt: task.createdAt,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
        progress: task.progress,
        result: task.result
          ? {
              followersCount: task.result.followersCount,
              filteredFollowersCount: task.result.filteredFollowersCount,
              addressesProcessed: task.result.addressesProcessed,
              totalUsdValue: task.result.totalUsdValue,
            }
          : undefined,
        error: task.error,
      })),
    });
  } catch (error) {
    logger.error("[API] Error listing tasks:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to list tasks",
    });
  }
});

// Start the server
async function startServer() {
  try {
    // Initialize the task queue (recover incomplete tasks from MongoDB)
    await queue.initialize();

    // Start listening for incoming requests
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
