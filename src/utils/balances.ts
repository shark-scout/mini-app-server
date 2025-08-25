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

export function getBalancesUsdValue(balances: Balance[]): number {
  logger.info(
    `[Balances] Calculating USD value for ${balances.length} balances`
  );
  let balancesUsdValue = 0;
  for (const balance of balances) {
    logger.info(
      `[Balances] Calculating USD value for address: ${balance.address}, Tokens: ${balance.alchemyTokens.length}`
    );
    let tokensUsdValue = 0;
    for (const token of balance.alchemyTokens) {
      // Find USD price for the token
      const usdPrice = token.tokenPrices.find(
        (price) => price.currency === "usd"
      );

      if (!usdPrice) {
        continue;
      }

      // Convert hex tokenBalance to decimal
      const tokenBalanceHex = token.tokenBalance;
      const tokenBalanceDecimal = BigInt(tokenBalanceHex);

      // Get token decimals from tokenMetadata
      let decimals = token.tokenMetadata.decimals;

      // If tokenAddress is null, it's ETH with 18 decimals
      if (token.tokenAddress === null) {
        decimals = 18;
      }

      // Skip tokens without decimal information as we can't calculate accurate balance
      if (decimals === null || decimals === undefined) {
        continue;
      }

      // Calculate actual token amount
      const divisor = BigInt(10 ** decimals);
      const actualTokenAmount = Number(tokenBalanceDecimal) / Number(divisor);

      // Calculate USD value
      const tokenPriceValue = parseFloat(usdPrice.value);
      const tokenUsdValue = actualTokenAmount * tokenPriceValue;

      // Add to result
      tokensUsdValue += tokenUsdValue;

      logger.info(
        `[Balances] Token: ${
          token.tokenMetadata.symbol || "Unknown"
        }, Balance: ${actualTokenAmount}, Price: $${tokenPriceValue}, Value: $${tokenUsdValue.toFixed(
          2
        )}`
      );
    }

    logger.info(
      `[Balances] USD value for address ${
        balance.address
      }: $${tokensUsdValue.toFixed(2)}`
    );

    // Add to total USD value for balances
    balancesUsdValue += tokensUsdValue;
  }

  return balancesUsdValue;
}
