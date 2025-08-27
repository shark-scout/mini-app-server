import dotenv from "dotenv";
dotenv.config();

import { getTokensByWallet } from "../utils/alchemy";
import { logger } from "../utils/logger";

async function main() {
  logger.info("Starting script...");

  const address = "0x52793D3B013e826235655C59a69175fcEb20C654";
  await getTokensByWallet(address);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
