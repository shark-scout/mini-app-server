import { ObjectId } from "mongodb";
import { mongodbConfig } from "../../config/mongodb";
import { TaskStatus } from "../../types/task";
import { logger } from "../../utils/logger";
import { Task } from "../models/task";
import { getCollection } from "./collections";

export async function findTasks(args?: {
  id?: string;
  fid?: number;
  statuses?: TaskStatus[];
}): Promise<Task[]> {
  logger.info("[MongoDB] Finding tasks...");
  const collection = await getCollection<Task>(mongodbConfig.collections.tasks);
  const tasks = await collection
    .find({
      ...(args?.id !== undefined && { _id: new ObjectId(args.id) }),
      ...(args?.fid !== undefined && { fid: args.fid }),
      ...(args?.statuses !== undefined && { status: { $in: args.statuses } }),
    })
    .sort({ createdAt: 1 })
    .toArray();
  return tasks;
}

export async function upsertTask(task: Task): Promise<void> {
  logger.info("[MongoDB] Upserting task...");
  const collection = await getCollection<Task>(mongodbConfig.collections.tasks);
  await collection.replaceOne({ _id: task._id }, task, { upsert: true });
}
