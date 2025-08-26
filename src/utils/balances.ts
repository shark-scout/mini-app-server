import { Balance } from "../mongodb/models/balance";
import { findBalances, insertBalance } from "../mongodb/services/balances";
import { AlchemyToken } from "../types/alchemy-token";
import { getTokensByWallet, getTokenUsdValue } from "./alchemy";
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
  let iterationPageKey: string | undefined = undefined;
  let totalTokens: AlchemyToken[] = [];

  do {
    const { tokens, pageKey } = await getTokensByWallet(
      address,
      iterationPageKey
    );

    // Add tokens to the total collection
    totalTokens = totalTokens.concat(tokens);

    // Update page key for next iteration
    iterationPageKey = pageKey;

    // Wait to avoid hitting Alchemy API rate limits
    await new Promise((resolve) => setTimeout(resolve, 500)); // TODO: Adjust delay for production use

    logger.info(
      `[Balances] Retrieved ${tokens.length} tokens from Alchemy API. Total: ${totalTokens.length}`
    );
  } while (iterationPageKey);

  logger.info(
    `[Balances] Retrieved total ${totalTokens.length} tokens from Alchemy API`
  );

  // Insert balance into MongoDB
  const balance: Balance = {
    createdAt: new Date(),
    address: address,
    alchemyTokens: totalTokens,
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

export function getBalancesUsdValue(balances: Balance[]): number {
  logger.info(`[Balances] Getting USD value for ${balances.length} balances`);
  let balancesUsdValue = 0;
  // Iterate each balance
  for (const balance of balances) {
    logger.info(
      `[Balances] Getting USD value for address: ${balance.address}. Tokens: ${balance.alchemyTokens.length}`
    );
    let tokensUsdValue = 0;
    // Iterate each token in the balance
    for (const token of balance.alchemyTokens) {
      const tokenUsdValue = getTokenUsdValue(token);
      if (tokenUsdValue) {
        tokensUsdValue += tokenUsdValue;
      }
    }
    logger.info(
      `[Balances] USD value for address ${
        balance.address
      }: $${tokensUsdValue.toFixed(2)}`
    );

    // Add to USD value for balances
    balancesUsdValue += tokensUsdValue;
  }

  return balancesUsdValue;
}
