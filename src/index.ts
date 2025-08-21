import dotenv from "dotenv";
dotenv.config();

import { demoNeynarFollowsOne } from "./demo/neynar-follows-one";
import { findHistories } from "./mongodb/services/histories";
import { logger } from "./utils/logger";
import { createDashboard } from "./utils/dashboards";

async function main() {
  logger.info("Starting script...");

  // Init data
  const fid = 1;
  const follows = demoNeynarFollowsOne;
  const users = follows.map((follow) => follow.user);

  // Create histories
  // const addresses = users.flatMap(
  //   (user) => user.verified_addresses.eth_addresses
  // );
  // const minMinedAt = new Date("2025-08-19T00:00:00+03:00");
  // const maxMinedAt = new Date("2025-08-21T00:00:00+03:00");
  // await createHistories(addresses, minMinedAt, maxMinedAt);

  // Load histories
  // TODO: Find by minMinedAt and maxMinedAt
  const histories = await findHistories({});
  logger.info(`Loaded ${histories.length} histories`);

  // Create dashboard
  await createDashboard(fid, histories, users);

  // Wait for 2 seconds to make sure the logs are saved
  logger.info("Waiting for 2 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
