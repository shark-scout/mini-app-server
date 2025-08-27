export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum TaskProcessingStage {
  FETCHING_FOLLOWERS = "fetching_followers",
  CREATING_BALANCES = "creating_balances",
  COMPLETED = "completed",
}

export type TaskResult = {
  followers: number;
  filteredFollowers: number;
  addresses: number;
  balances: number;
  balancesUsdValue: number;
};
