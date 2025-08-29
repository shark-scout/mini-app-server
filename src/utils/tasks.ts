import { notificationsConfig } from "../config/notifications";
import { taskConfig } from "../config/task";
import { findBalances } from "../mongodb/services/balances";
import { TaskProcessingStage, TaskResult } from "../types/task";
import { createBalances } from "./balances";
import { logger } from "./logger";
import { fetchUserFollowers, sendNotification } from "./neynar";

export async function processTask(
  fid: number,
  onProcessingStageUpdate: (processingStage: TaskProcessingStage) => void
): Promise<TaskResult> {
  logger.info(`[Tasks] Processing task for FID: ${fid}`);

  // Fetch user's information to get their wallet address
  // TODO:

  // Fetch and filter followers
  onProcessingStageUpdate(TaskProcessingStage.FETCHING_FOLLOWERS);
  const followers = await fetchUserFollowers(fid);
  const filteredFollowers = followers.filter(
    (follower) =>
      follower.user.score && follower.user.score >= taskConfig.minNeynarScore
  );

  // Create balance for each address if it doesn't exist
  onProcessingStageUpdate(TaskProcessingStage.CREATING_BALANCES);
  const addresses = filteredFollowers
    .map((follower) => follower.user.verified_addresses.primary.eth_address)
    .filter((address) => address !== null);
  const { createdCount: createdBalancesCount } = await createBalances(
    addresses
  );

  // Finding balances for all addresses
  const balances = await findBalances({ addresses });

  // Calculate balances USD value
  const balancesUsdValue = balances.reduce(
    (balancesUsdValue, balance) =>
      balancesUsdValue + balance.alchemyTokensUsdValue,
    0
  );

  // Send notification to user
  onProcessingStageUpdate(TaskProcessingStage.SENDING_NOTIFICATION);
  const notificationStatus = await sendNotification(
    fid,
    notificationsConfig.title,
    notificationsConfig.body,
    notificationsConfig.targetUrl
  );

  // Return the results
  return {
    followers: followers.length,
    filteredFollowers: filteredFollowers.length,
    addresses: addresses.length,
    createdBalances: createdBalancesCount,
    balances: balances.length,
    balancesUsdValue: balancesUsdValue,
    notificationStatus: notificationStatus,
  };
}
