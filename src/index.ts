import dotenv from "dotenv";
dotenv.config();

import { logger } from "./utils/logger";

async function main() {
  logger.info("Starting script...");

  // Sleep for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
