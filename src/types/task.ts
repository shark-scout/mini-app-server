export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum TaskProcessingStage {
  FETCHING_USER = "fetching_user",
  FETCHING_FOLLOWERS = "fetching_followers",
  CREATING_BALANCES = "creating_balances",
  SENDING_NOTIFICATION = "sending_notification",
  COMPLETED = "completed",
}

export type TaskResult = {
  user: boolean;
  followers: number;
  filteredFollowers: number;
  addresses: number;
  createdBalances: number;
  balances: number;
  balancesUsdValue: number;
  notificationStatus: string;
};
