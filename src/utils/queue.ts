import { ObjectId } from "mongodb";
import { Task } from "../mongodb/models/task";
import { findTasks, upsertTask } from "../mongodb/services/tasks";
import { TaskProgress, TaskStatus } from "../types/task";
import { logger } from "./logger";
import { processTaskWithProgress } from "./tasks";

export class Queue {
  private queue: Task[] = [];
  private processing = false;
  private currentTask: Task | null = null;
  private initialized = false;

  /**
   * Initialize the queue by recovering incomplete tasks from MongoDB
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      logger.info(
        "[Queue] Initializing task queue and recovering incomplete tasks..."
      );

      // Get incomplete tasks from MongoDB
      const incompleteTasks = await findTasks({
        statuses: [TaskStatus.PENDING, TaskStatus.PROCESSING],
      });

      if (incompleteTasks.length > 0) {
        // Reset PROCESSING tasks back to PENDING as they were interrupted
        for (const task of incompleteTasks) {
          if (task.status === TaskStatus.PROCESSING) {
            task.status = TaskStatus.PENDING;
            delete task.progress; // Clear previous progress
            await upsertTask(task);
            logger.info(
              `[Queue] Reset interrupted task ${task._id} back to PENDING`
            );
          }
        }

        // Add all pending tasks to the queue
        this.queue = incompleteTasks
          .filter((task) => task.status === TaskStatus.PENDING)
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        logger.info(
          `[Queue] Recovered ${this.queue.length} pending tasks from MongoDB`
        );
      }

      this.initialized = true;
      logger.info("[Queue] Initialization completed");

      // Start processing if we have tasks
      if (this.queue.length > 0 && !this.processing) {
        logger.info(`[Queue] Starting processing of recovered tasks...`);
        setImmediate(() => this.processNext());
      }
    } catch (error) {
      logger.error("[Queue] Failed to initialize task queue:", error);
      this.initialized = true; // Mark as initialized anyway to prevent retries
    }
  }

  /**
   * Add a new task to the queue
   */
  async addTask(fid: number): Promise<{ task: Task; existing: boolean }> {
    // Initialize if not already done
    if (!this.initialized) {
      await this.initialize();
    }

    // Check if task already exists for this FID
    const existingTask = await this.getTask(fid);
    if (existingTask) {
      logger.info(`[Queue] Task for FID ${fid} already exists`);
      return { task: existingTask, existing: true };
    }

    // Create new task
    const task: Task = {
      fid,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      _id: new ObjectId(),
    };

    // Save task to MongoDB
    await upsertTask(task);

    // Add to in-memory queue
    this.queue.push(task);
    logger.info(
      `[Queue] Task ${task._id} added to queue for FID: ${fid}. Queue length: ${this.queue.length}`
    );

    // Start processing if not already processing
    if (!this.processing) {
      setImmediate(() => this.processNext());
    }

    return { task, existing: false };
  }

  /**
   * Get task by FID
   */
  async getTask(fid: number): Promise<Task | undefined> {
    // Initialize if not already done
    if (!this.initialized) {
      await this.initialize();
    }

    // Check current task
    if (this.currentTask?.fid === fid) {
      return this.currentTask;
    }

    // Check in pending queue
    const queuedTask = this.queue.find((task) => task.fid === fid);
    if (queuedTask) {
      return queuedTask;
    }

    // Check in MongoDB
    const tasks = await findTasks({ fid: fid });
    return tasks[0];
  }

  /**
   * Process the next task in the queue
   */
  private async processNext(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    this.currentTask = this.queue.shift()!;

    logger.info(
      `[Queue] Starting task ${this.currentTask._id} for FID: ${this.currentTask.fid}`
    );

    // Update task status
    this.currentTask.status = TaskStatus.PROCESSING;
    this.currentTask.startedAt = new Date();

    // Save status update to MongoDB
    await upsertTask(this.currentTask);

    try {
      // Process the task with progress updates
      const result = await processTaskWithProgress(
        this.currentTask.fid,
        (progress: TaskProgress) => {
          if (this.currentTask) {
            this.currentTask.progress = progress;

            logger.info(
              `[Queue] Task ${this.currentTask._id} progress: ${progress.message} (${progress.completedSteps}/${progress.totalSteps})`
            );

            // Save progress updates to MongoDB (async, but don't wait)
            upsertTask(this.currentTask).catch((error) => {
              logger.error(
                `[Queue] Failed to save progress for task ${this.currentTask?._id}:`,
                error
              );
            });
          }
        }
      );

      // Task completed successfully
      this.currentTask.status = TaskStatus.COMPLETED;
      this.currentTask.completedAt = new Date();
      this.currentTask.result = result;
      this.currentTask.progress = {
        stage: "completed",
        completedSteps: 4,
        totalSteps: 4,
        message: "Task completed successfully",
      };

      logger.info(
        `[Queue] Task ${
          this.currentTask._id
        } completed successfully. USD Value: $${result.totalUsdValue.toFixed(
          2
        )}`
      );
    } catch (error) {
      // Task failed
      this.currentTask.status = TaskStatus.FAILED;
      this.currentTask.completedAt = new Date();
      this.currentTask.error =
        error instanceof Error ? error.message : String(error);

      logger.error(`[Queue] Task ${this.currentTask._id} failed:`, error);
    } finally {
      // Save final task state to MongoDB
      if (this.currentTask) {
        await upsertTask(this.currentTask);
      }

      // Reset processing state and continue with next task
      this.processing = false;
      this.currentTask = null;

      // Process next task in queue if any
      if (this.queue.length > 0) {
        logger.info(
          `[Queue] Processing next task. Remaining in queue: ${this.queue.length}`
        );
        setImmediate(() => this.processNext());
      } else {
        logger.info(`[Queue] Queue is empty. Waiting for new tasks.`);
      }
    }
  }
}

// Singleton instance
export const queue = new Queue();
