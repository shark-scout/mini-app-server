import { Balance } from "../mongodb/models/balance";
import { findBalances, insertBalance } from "../mongodb/services/balances";
import { getTokensByWallet, getTokensUsdValue } from "./alchemy";
import { logger } from "./logger";

async function createBalance(address: string): Promise<void> {
  logger.info(`[Balances] Creating balance for address: ${address}`);

  // Check if balance already exists
  const balances = await findBalances({ address });
  if (balances.length !== 0) {
    logger.info("[Balances] Balance already exists");
    return;
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
}

export async function createBalances(addresses: string[]): Promise<void> {
  logger.info(`[Balances] Creating balances for ${addresses.length} addresses`);
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    if (!address) {
      continue;
    }
    await createBalance(address);
  }
}
