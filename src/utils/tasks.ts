import { TaskResult, TaskProcessingStage } from "../types/task";
import { logger } from "./logger";

// export async function processTask(fid: number) {
//   logger.info(`[Tasks] Processing task for FID: ${fid}`);

//   // Load followers
//   // TODO: Use Neynar API
//   const followers = demoNeynarFollowers;
//   logger.info(`[Tasks] Followers: ${followers.length}`);

//   // Filter followers
//   const filteredFollowers = followers.filter(
//     (follower) => follower.user.score >= 0.9
//   );
//   logger.info(`[Tasks] Filtered followers: ${filteredFollowers.length}`);

//   // Define addresses for processing
//   const addresses = filteredFollowers
//     .map((follower) => follower.user.verified_addresses.primary.eth_address)
//     .filter((address) => address !== null);
//   logger.info(`[Tasks] Addresses for processing: ${addresses.length}`);

//   // Create balances
//   await createBalances(addresses);

//   // Load balances
//   const balances = await findBalances({ addresses: addresses });
//   logger.info(`[Tasks] Found balances: ${balances.length}`);

//   // Calculate USD value for balances
//   let balancesUsdValue = getBalancesUsdValue(balances);
//   logger.info(
//     `[Tasks] USD value for balances: $${balancesUsdValue.toFixed(2)}`
//   );
// }

// TODO: Implement steps
export async function processTask(
  fid: number,
  onProcessingStageUpdate: (processingStage: TaskProcessingStage) => void
): Promise<TaskResult> {
  logger.info(`[Tasks] Processing task for FID: ${fid}`);

  // Step 1: Load followers
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
  onProcessingStageUpdate(TaskProcessingStage.LOADING_FOLLOWERS);

  // Step 2: Filter followers
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
  onProcessingStageUpdate(TaskProcessingStage.FILTERING);

  // Step 3: Fetch balances
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
  onProcessingStageUpdate(TaskProcessingStage.FETCHING_BALANCES);

  // Step 4: Calculate USD value
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
  onProcessingStageUpdate(TaskProcessingStage.CALCULATING_VALUE);

  // Return the results
  return {
    followersCount: 0,
    filteredFollowersCount: 0,
    addressesProcessed: 0,
    totalUsdValue: 0,
  };
}
