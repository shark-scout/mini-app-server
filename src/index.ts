import dotenv from "dotenv";
dotenv.config();

import { logger } from "./utils/logger";

async function main() {
  logger.info("Starting script...");

  // Load users
  // const users = demoNeynarFollows.map((follow) => follow.user);

  // // Create transactions
  // const addresses = users.flatMap(
  //   (user) => user.verified_addresses.eth_addresses
  // );
  // const minMinedAt = new Date("2025-08-19T00:00:00+03:00").getTime();
  // await createTransactions(addresses, minMinedAt);

  // // Load transactions
  // const transactions = await findTransactions();
  // logger.info(`Loaded ${transactions.length} transactions`);

  // // Create trends
  // await createTrends(transactions, users);

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
