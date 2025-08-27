import dotenv from "dotenv";
dotenv.config();

import { createBalances } from "../utils/balances";
import { logger } from "../utils/logger";

async function main() {
  logger.info("[Tool] Starting script...");

  const addresses = [
    "0x52793D3B013e826235655C59a69175fcEb20C654",
    "0xb127a792C83a72e6d961df9E41a5E414e22d80Ba",
  ];
  await createBalances(addresses);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
