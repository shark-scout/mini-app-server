import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";
import { fetchUserFollowers } from "../utils/neynar";

async function main() {
  logger.info("Starting script...");

  const fid = 1094198;
  await fetchUserFollowers(fid);

  logger.info("Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
