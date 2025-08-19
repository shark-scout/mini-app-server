import dotenv from "dotenv";
dotenv.config();

import { Transaction } from "./mongodb/models/transaction";
import { insertTransactions } from "./mongodb/services/transactions";
import { logger } from "./utils/logger";
import { getListOfWalletTransactions } from "./utils/zerion";

async function main() {
  logger.info("Starting script...");

  // Load and save transactions
  const address = "0x6535c0315b9668a3e38dfcaeee102705d0a74741"; // @flynn.eth
  const zerionTransactions = await getListOfWalletTransactions(address);
  const transactions: Transaction[] = zerionTransactions.map((zt) => ({
    created: new Date(),
    address: address,
    zerionTransaction: zt,
  }));
  await insertTransactions(transactions);

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
