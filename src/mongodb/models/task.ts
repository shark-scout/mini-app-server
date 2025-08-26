import { ObjectId } from "mongodb";
import { TaskStatus, TaskProgress, TaskResult } from "../../types/task";

export class Task {
  constructor(
    public id: string,
    public fid: number,
    public status: TaskStatus,
    public createdAt: Date,
    public startedAt?: Date,
    public completedAt?: Date,
    public progress?: TaskProgress,
    public result?: TaskResult,
    public error?: string,
    public _id?: ObjectId
  ) {}
}
