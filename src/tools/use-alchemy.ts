import dotenv from "dotenv";
dotenv.config();

import { getTokensByWallet, getTokensUsdValue } from "../utils/alchemy";
import { logger } from "../utils/logger";

async function main() {
  logger.info("[Tool] Starting script...");

  const address = "0xa32ad653ddb29aafaf67ca906f7bcee145444746";
  const tokens = await getTokensByWallet(address);
  const tokensUsdValue = getTokensUsdValue(tokens);
  logger.info(`[Tool] Tokens USD Value: $${tokensUsdValue}`);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Tool] Script finished");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
