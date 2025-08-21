import dotenv from "dotenv";
dotenv.config();

import { demoNeynarFollowsTwo } from "./demo/neynar-follows-two";
import { findHistories } from "./mongodb/services/histories";
import { createDashboard } from "./utils/dashboards";
import { logger } from "./utils/logger";

async function main() {
  logger.info("Starting script...");

  // Init data
  const fid = 1;
  const follows = demoNeynarFollowsTwo;
  const users = follows.map((follow) => follow.user);
  const topUsers = users.filter((user) => user.score >= 0.9);
  const topUserAddresses = topUsers.flatMap(
    (user) => user.verified_addresses.eth_addresses
  );
  const minMinedAt = new Date("2025-08-20T00:00:00+03:00");
  const maxMinedAt = new Date("2025-08-21T00:00:00+03:00");

  logger.info(`Users: ${users.length}`);
  logger.info(`Top users: ${topUsers.length}`);
  logger.info(`Top user addresses: ${topUserAddresses.length}`);

  // // Create histories
  // await createHistories(addresses, minMinedAt, maxMinedAt);

  // Load histories
  const histories = await findHistories({
    addresses: topUserAddresses,
    minMinedAt,
    maxMinedAt,
  });
  logger.info(`Histories: ${histories.length}`);
  logger.info(
    `Histories with transactions: ${
      histories.filter((h) => h.zerionTransactions.length > 0).length
    }`
  );

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
