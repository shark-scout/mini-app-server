import { Balance } from "../mongodb/models/balance";
import { findBalances, insertBalance } from "../mongodb/services/balances";
import { getTokensByWallet } from "./alchemy";
import { logger } from "./logger";

export async function createBalances(addresses: string[]): Promise<void> {
  logger.info(`[Balances] Creating balances for ${addresses.length} addresses`);
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    if (!address) {
      continue;
    }
    logger.info(
      `[Balances] Creating balance for address: ${address}, ${i + 1}/${
        addresses.length
      }`
    );
    // Check if balance already exists
    const balances = await findBalances({ address });
    if (balances.length !== 0) {
      logger.info("[Balances] Balance already exists");
      continue;
    }
    // Get tokens from Alchemy API
    // TODO: Load tokens from the next page if there are more than 100 tokens
    const alchemyTokens = await getTokensByWallet(address);
    logger.info(
      `[Balances] Retrieved ${alchemyTokens.length} tokens from Alchemy API`
    );
    // Insert balance into MongoDB
    const balance: Balance = {
      created: new Date(),
      address: address,
      alchemyTokens: alchemyTokens,
    };
    await insertBalance(balance);
    // Wait to avoid hitting Alchemy API rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
