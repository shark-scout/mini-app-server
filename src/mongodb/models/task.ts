import { ObjectId } from "mongodb";
import { TaskProcessingStage, TaskResult, TaskStatus } from "../../types/task";

export class Task {
  constructor(
    public createdAt: Date,
    public fid: number,
    public status: TaskStatus,
    public startedAt?: Date,
    public completedAt?: Date,
    public processingStage?: TaskProcessingStage,
    public result?: TaskResult,
    public error?: string,
    public _id?: ObjectId
  ) {}
}
