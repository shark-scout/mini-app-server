export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface TaskProgress {
  stage:
    | "loading_followers"
    | "filtering"
    | "fetching_balances"
    | "calculating_value"
    | "completed";
  completedSteps: number;
  totalSteps: number;
  message: string;
}

export interface TaskResult {
  followersCount: number;
  filteredFollowersCount: number;
  addressesProcessed: number;
  totalUsdValue: number;
}

export interface Task {
  id: string;
  fid: number;
  status: TaskStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress?: TaskProgress;
  result?: TaskResult;
  error?: string;
}
