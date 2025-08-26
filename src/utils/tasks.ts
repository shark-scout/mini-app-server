import { demoNeynarFollowers } from "../demo/neynar-followers";
import { findBalances } from "../mongodb/services/balances";
import { createBalances, getBalancesUsdValue } from "./balances";
import { logger } from "./logger";
import { TaskProgress, TaskResult } from "../types/task";

export async function processTask(fid: number) {
  logger.info(`[Tasks] Processing task for FID: ${fid}`);

  // Load followers
  // TODO: Use Neynar API
  const followers = demoNeynarFollowers;
  logger.info(`[Tasks] Followers: ${followers.length}`);

  // Filter followers
  const filteredFollowers = followers.filter(
    (follower) => follower.user.score >= 0.9
  );
  logger.info(`[Tasks] Filtered followers: ${filteredFollowers.length}`);

  // Define addresses for processing
  const addresses = filteredFollowers
    .map((follower) => follower.user.verified_addresses.primary.eth_address)
    .filter((address) => address !== null);
  logger.info(`[Tasks] Addresses for processing: ${addresses.length}`);

  // Create balances
  await createBalances(addresses);

  // Load balances
  const balances = await findBalances({ addresses: addresses });
  logger.info(`[Tasks] Found balances: ${balances.length}`);

  // Calculate USD value for balances
  let balancesUsdValue = getBalancesUsdValue(balances);
  logger.info(
    `[Tasks] USD value for balances: $${balancesUsdValue.toFixed(2)}`
  );
}

export async function processTaskWithProgress(
  fid: number,
  onProgress: (progress: TaskProgress) => void
): Promise<TaskResult> {
  logger.info(`[Tasks] Processing task with progress for FID: ${fid}`);

  // Step 1: Load followers
  onProgress({
    stage: "loading_followers",
    completedSteps: 0,
    totalSteps: 4,
    message: "Loading followers data...",
  });

  // Add small delay to demonstrate queue processing
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  // TODO: Implement step

  // Step 2: Filter followers
  onProgress({
    stage: "filtering",
    completedSteps: 1,
    totalSteps: 4,
    message: "Filtering high-value followers...",
  });

  // Add small delay to demonstrate queue processing
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  // TODO: Implement step

  // Step 3: Fetch balances
  onProgress({
    stage: "fetching_balances",
    completedSteps: 2,
    totalSteps: 4,
    message: "Fetching token balances from blockchain...",
  });

  // Add small delay to demonstrate queue processing
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  // TODO: Implement step

  // Step 4: Calculate USD value
  onProgress({
    stage: "calculating_value",
    completedSteps: 3,
    totalSteps: 4,
    message: "Calculating total USD value...",
  });

  // Add small delay to demonstrate queue processing
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  // TODO: Implement step

  // Return the results
  return {
    followersCount: 0,
    filteredFollowersCount: 0,
    addressesProcessed: 0,
    totalUsdValue: 0,
  };
}
