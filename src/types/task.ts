export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum TaskProcessingStage {
  LOADING_FOLLOWERS = "loading_followers",
  FILTERING = "filtering",
  FETCHING_BALANCES = "fetching_balances",
  CALCULATING_VALUE = "calculating_value",
  COMPLETED = "completed",
}

export type TaskResult = {
  followersCount: number;
  filteredFollowersCount: number;
  addressesProcessed: number;
  totalUsdValue: number;
};
