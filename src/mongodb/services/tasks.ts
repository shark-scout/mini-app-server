import { mongodbConfig } from "../../config/mongodb";
import { TaskStatus } from "../../types/task";
import { logger } from "../../utils/logger";
import { Task } from "../models/task";
import { getCollection } from "./collections";

/**
 * Create or update a task in MongoDB
 */
export async function upsertTask(task: Task): Promise<void> {
  try {
    const collection = await getCollection<Task>(
      mongodbConfig.collections.tasks
    );

    await collection.replaceOne({ id: task.id }, task, { upsert: true });

    logger.debug(`[TasksService] Task ${task.id} upserted to MongoDB`);
  } catch (error) {
    logger.error(`[TasksService] Failed to upsert task ${task.id}:`, error);
    throw error;
  }
}

/**
 * Get a task by ID
 */
export async function getTask(taskId: string): Promise<Task | null> {
  try {
    const collection = await getCollection<Task>(
      mongodbConfig.collections.tasks
    );
    const taskModel = await collection.findOne({ id: taskId });

    return taskModel;
  } catch (error) {
    logger.error(`[TasksService] Failed to get task ${taskId}:`, error);
    return null;
  }
}

/**
 * Get tasks by status
 */
export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  try {
    const collection = await getCollection<Task>(
      mongodbConfig.collections.tasks
    );
    const taskModels = await collection
      .find({ status })
      .sort({ createdAt: 1 })
      .toArray();

    return taskModels;
  } catch (error) {
    logger.error(
      `[TasksService] Failed to get tasks by status ${status}:`,
      error
    );
    return [];
  }
}

/**
 * Get all tasks
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    const collection = await getCollection<Task>(
      mongodbConfig.collections.tasks
    );
    const taskModels = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return taskModels;
  } catch (error) {
    logger.error(`[TasksService] Failed to get all tasks:`, error);
    return [];
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const collection = await getCollection<Task>(
      mongodbConfig.collections.tasks
    );
    const result = await collection.deleteOne({ id: taskId });

    logger.debug(`[TasksService] Task ${taskId} deleted from MongoDB`);
    return result.deletedCount > 0;
  } catch (error) {
    logger.error(`[TasksService] Failed to delete task ${taskId}:`, error);
    return false;
  }
}

/**
 * Get incomplete tasks (PENDING or PROCESSING) for recovery
 */
export async function getIncompleteTasks(): Promise<Task[]> {
  try {
    const collection = await getCollection<Task>(
      mongodbConfig.collections.tasks
    );
    const taskModels = await collection
      .find({
        status: { $in: [TaskStatus.PENDING, TaskStatus.PROCESSING] },
      })
      .sort({ createdAt: 1 })
      .toArray();

    return taskModels;
  } catch (error) {
    logger.error(`[TasksService] Failed to get incomplete tasks:`, error);
    return [];
  }
}
