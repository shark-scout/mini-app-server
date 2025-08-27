import { taskConfig } from "../config/task";
import { findBalances } from "../mongodb/services/balances";
import { TaskResult, TaskProcessingStage } from "../types/task";
import { createBalances } from "./balances";
import { logger } from "./logger";
import { fetchUserFollowers } from "./neynar";

export async function processTask(
  fid: number,
  onProcessingStageUpdate: (processingStage: TaskProcessingStage) => void
): Promise<TaskResult> {
  logger.info(`[Tasks] Processing task for FID: ${fid}`);

  // Fetch and filter followers
  onProcessingStageUpdate(TaskProcessingStage.FETCHING_FOLLOWERS);
  const followers = await fetchUserFollowers(fid);
  const filteredFollowers = followers.filter(
    (follower) =>
      follower.user.score && follower.user.score >= taskConfig.minNeynarScore
  );

  // Getting balances
  onProcessingStageUpdate(TaskProcessingStage.CREATING_BALANCES);
  const addresses = filteredFollowers
    .map((follower) => follower.user.verified_addresses.primary.eth_address)
    .filter((address) => address !== null);
  await createBalances(addresses);
  const balances = await findBalances({ addresses });

  // Calculate balances USD value
  const balancesUsdValue = balances.reduce(
    (balancesUsdValue, balance) =>
      balancesUsdValue + balance.alchemyTokensUsdValue,
    0
  );

  // Return the results
  return {
    followers: followers.length,
    filteredFollowers: filteredFollowers.length,
    addresses: addresses.length,
    balances: balances.length,
    balancesUsdValue: balancesUsdValue,
  };
}
