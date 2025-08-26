import { ObjectId } from "mongodb";
import { TaskProgress, TaskResult, TaskStatus } from "../../types/task";

export class Task {
  constructor(
    public createdAt: Date,
    public fid: number,
    public status: TaskStatus,
    public startedAt?: Date,
    public completedAt?: Date,
    public progress?: TaskProgress,
    public result?: TaskResult,
    public error?: string,
    public _id?: ObjectId
  ) {}
}
