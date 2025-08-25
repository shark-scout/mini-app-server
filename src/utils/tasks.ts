import { demoNeynarFollowers } from "../demo/neynar-followers";
import { findBalances } from "../mongodb/services/balances";
import { createBalances, getBalancesUsdValue } from "./balances";
import { logger } from "./logger";

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
