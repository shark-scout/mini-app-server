import { Balance } from "../mongodb/models/balance";
import { findBalances, insertBalance } from "../mongodb/services/balances";
import { getTokensByWallet, getTokensUsdValue } from "./alchemy";
import { logger } from "./logger";

export async function createBalances(
  addresses: string[]
): Promise<{ createdCount: number }> {
  logger.info(`[Balances] Creating balances for ${addresses.length} addresses`);

  // Create balance for each address if it doesn't exist and save number of created balances
  let createdCount = 0;
  for (let i = 0; i < addresses.length; i++) {
    // Skip empty addresses
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
    const alchemyTokens = await getTokensByWallet(address);

    // Insert balance into MongoDB
    const balance: Balance = {
      createdAt: new Date(),
      address: address,
      alchemyTokens: alchemyTokens,
      alchemyTokensUsdValue: getTokensUsdValue(alchemyTokens),
    };
    await insertBalance(balance);

    createdCount++;
  }

  logger.info(`[Balances] Created ${createdCount} balances`);

  return { createdCount };
}
