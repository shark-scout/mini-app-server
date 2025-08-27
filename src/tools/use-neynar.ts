import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";
import { fetchUserFollowers } from "../utils/neynar";

async function main() {
  logger.info("Starting script...");

  const fid = 1094198;
  const followers = await fetchUserFollowers(fid);
  const filteredFollowers = followers.filter(
    (follower) => follower.user.score && follower.user.score >= 0.9
  );
  const addresses = filteredFollowers
    .map((follower) => follower.user.verified_addresses.primary.eth_address)
    .filter((address) => address !== null);
  logger.info(`Total followers: ${followers.length}`);
  logger.info(`Filtered followers: ${filteredFollowers.length}`);
  logger.info(`Addresses: ${addresses.length}`);
  logger.info(`Addresses: ${JSON.stringify(addresses)}`);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
