import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { logger } from "./utils/logger";
import { taskQueue } from "./utils/task-queue";

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

    logger.info(`[API] Creating task for FID: ${fid}`);

    // Add task to queue
    const task = taskQueue.addTask(fid);

    return res.json({
      success: true,
      message: `Task created for FID: ${fid}`,
      taskId: task.id,
      status: task.status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("[API] Error creating task:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to create task",
    });
  }
});

// API endpoint to get task status
app.get("/api/tasks/:taskId", (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        error: "Invalid request",
        message: "taskId parameter is required",
      });
    }

    const task = taskQueue.getTask(taskId);

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
        message: `Task with ID ${taskId} does not exist`,
      });
    }

    return res.json({
      success: true,
      task: {
        id: task.id,
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
app.get("/api/tasks", (_req: Request, res: Response) => {
  try {
    const tasks = taskQueue.getAllTasks();
    const queueStatus = taskQueue.getStatus();

    return res.json({
      success: true,
      queueStatus,
      tasks: tasks.map((task) => ({
        id: task.id,
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
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Start task: POST http://localhost:${PORT}/api/tasks/start`);
  logger.info(
    `Get task status: GET http://localhost:${PORT}/api/tasks/:taskId`
  );
  logger.info(`List all tasks: GET http://localhost:${PORT}/api/tasks`);
});
