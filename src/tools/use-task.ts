import dotenv from "dotenv";
dotenv.config();

import { logger } from "../utils/logger";
import { processTask } from "../utils/tasks";

async function main() {
  logger.info("[Tool] Starting script...");

  const fid = 1094198;
  const result = await processTask(fid, (stage) => {
    logger.info(`[Tool] Stage: ${stage}`);
  });
  logger.info(`[Tool] Task result: ${JSON.stringify(result)}`);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
