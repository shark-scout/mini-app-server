export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export type TaskProgress = {
  stage:
    | "loading_followers"
    | "filtering"
    | "fetching_balances"
    | "calculating_value"
    | "completed";
  completedSteps: number;
  totalSteps: number;
  message: string;
};

export type TaskResult = {
  followersCount: number;
  filteredFollowersCount: number;
  addressesProcessed: number;
  totalUsdValue: number;
};
