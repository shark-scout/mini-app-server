import { randomUUID } from "crypto";
import { Task, TaskStatus, TaskProgress } from "../types/task";
import { logger } from "./logger";
import { processTaskWithProgress } from "./tasks";

export class TaskQueue {
  private queue: Task[] = [];
  private processing = false;
  private currentTask: Task | null = null;
  private completedTasks: Task[] = []; // Store completed tasks for history

  /**
   * Add a new task to the queue
   */
  addTask(fid: number): Task {
    const task: Task = {
      id: randomUUID(),
      fid,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
    };

    this.queue.push(task);
    logger.info(
      `[TaskQueue] Task ${task.id} added to queue for FID: ${fid}. Queue length: ${this.queue.length}`
    );

    // Start processing if not already processing
    if (!this.processing) {
      setImmediate(() => this.processNext());
    }

    return task;
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): Task | undefined {
    if (this.currentTask?.id === taskId) {
      return this.currentTask;
    }

    // Check in pending queue
    const queuedTask = this.queue.find((task) => task.id === taskId);
    if (queuedTask) {
      return queuedTask;
    }

    // Check in completed tasks
    return this.completedTasks.find((task) => task.id === taskId);
  }

  /**
   * Get all tasks (pending, current, and completed)
   */
  getAllTasks(): Task[] {
    const allTasks = [...this.completedTasks, ...this.queue];
    if (this.currentTask) {
      allTasks.unshift(this.currentTask);
    }
    return allTasks;
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      currentTask: this.currentTask
        ? {
            id: this.currentTask.id,
            fid: this.currentTask.fid,
            status: this.currentTask.status,
            progress: this.currentTask.progress,
          }
        : null,
    };
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
      `[TaskQueue] Starting task ${this.currentTask.id} for FID: ${this.currentTask.fid}`
    );

    // Update task status
    this.currentTask.status = TaskStatus.PROCESSING;
    this.currentTask.startedAt = new Date();

    try {
      // Process the task with progress updates
      const result = await processTaskWithProgress(
        this.currentTask.fid,
        (progress: TaskProgress) => {
          if (this.currentTask) {
            this.currentTask.progress = progress;
            logger.info(
              `[TaskQueue] Task ${this.currentTask.id} progress: ${progress.message} (${progress.completedSteps}/${progress.totalSteps})`
            );
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
        `[TaskQueue] Task ${
          this.currentTask.id
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

      logger.error(`[TaskQueue] Task ${this.currentTask.id} failed:`, error);
    } finally {
      // Move completed task to history
      if (this.currentTask) {
        this.completedTasks.push(this.currentTask);
        // Keep only last 100 completed tasks to prevent memory issues
        if (this.completedTasks.length > 100) {
          this.completedTasks = this.completedTasks.slice(-100);
        }
      }

      // Reset processing state and continue with next task
      this.processing = false;
      this.currentTask = null;

      // Process next task in queue if any
      if (this.queue.length > 0) {
        logger.info(
          `[TaskQueue] Processing next task. Remaining in queue: ${this.queue.length}`
        );
        setImmediate(() => this.processNext());
      } else {
        logger.info(`[TaskQueue] Queue is empty. Waiting for new tasks.`);
      }
    }
  }
}

// Singleton instance
export const taskQueue = new TaskQueue();
