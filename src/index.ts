import dotenv from "dotenv";
dotenv.config();

import { logger } from "./utils/logger";
import { processTask } from "./utils/tasks";

async function main() {
  logger.info("Starting script...");

  // Main code
  await processTask(0);

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
