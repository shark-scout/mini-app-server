import dotenv from "dotenv";
dotenv.config();

import { logger } from "./utils/logger";

async function main() {
  logger.info("Starting script...");

  // // Create transactions
  // const addresses = [
  //   "0x6535c0315b9668a3e38dfcaeee102705d0a74741", // @flynn.eth
  //   "0xb127a792c83a72e6d961df9e41a5e414e22d80ba", // @runn3rr
  // ];
  // const minMinedAt = new Date("2025-08-20T00:00:00+03:00").getTime();
  // await createTransactions(addresses, minMinedAt);

  // Load transactions
  // const transactions = await findTransactions();
  // logger.info(`Loaded ${transactions.length} transactions`);

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
