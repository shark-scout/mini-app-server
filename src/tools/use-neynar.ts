import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";
import { fetchUserFollowers } from "../utils/neynar";
import { taskConfig } from "../config/task";

async function main() {
  logger.info("[Tool] Starting script...");

  const fid = 298587;
  const followers = await fetchUserFollowers(fid);
  const filteredFollowers = followers.filter(
    (follower) =>
      follower.user.score && follower.user.score >= taskConfig.minNeynarScore
  );
  logger.info(`[Tool] Followers: ${followers.length}`);
  logger.info(`[Tool] Filtered followers: ${filteredFollowers.length}`);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
