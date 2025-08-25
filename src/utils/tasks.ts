import { demoNeynarFollowers } from "../demo/neynar-followers";
import { findBalances } from "../mongodb/services/balances";
import { createBalances } from "./balances";
import { logger } from "./logger";

export async function processTask(fid: number) {
  logger.info(`[Tasks] Processing task for FID: ${fid}`);

  // Load followers
  // TODO: Use Neynar API
  const followers = demoNeynarFollowers;
  logger.info(`[Tasks] Followers: ${followers.length}`);

  // Define addresses
  const users = followers.map((follow) => follow.user);
  const topUsers = users.filter((user) => user.score >= 0.9);
  const topUserAddresses = topUsers
    .map((user) => user.verified_addresses.primary.eth_address)
    .filter((address) => address !== null);
  logger.info(`[Tasks] Users: ${users.length}`);
  logger.info(`[Tasks] Top users: ${topUsers.length}`);
  logger.info(`[Tasks] Top user addresses: ${topUserAddresses.length}`);

  // Create balances
  await createBalances(topUserAddresses);

  // Load balances
  const balances = await findBalances({ addresses: topUserAddresses });
  logger.info(`[Tasks] Balances: ${balances.length}`);

  // Define task result
  // // TODO:
  // const result = 0;
}
