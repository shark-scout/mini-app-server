import axios from "axios";
import { alchemyConfig } from "../config/alchemy";
import { AlchemyToken } from "../types/alchemy-token";
import { logger } from "./logger";

function getTokenUsdValue(token: AlchemyToken): number | undefined {
  // Find USD price
  const usdPrice = token.tokenPrices.find((price) => price.currency === "usd");
  if (!usdPrice) {
    return undefined;
  }

  // Convert hex tokenBalance to decimal
  const balanceHex = token.tokenBalance;
  const balanceDecimal = BigInt(balanceHex);

  // Get token decimals from tokenMetadata
  let decimals = token.tokenMetadata.decimals;

  // If tokenAddress is null, it's ETH with 18 decimals
  if (token.tokenAddress === null) {
    decimals = 18;
  }

  // Skip tokens without decimal information as we can't calculate accurate balance
  if (decimals === null || decimals === undefined || decimals === 0) {
    return undefined;
  }

  // Calculate actual token amount
  const divisor = BigInt(10 ** decimals);
  const actualAmount = Number(balanceDecimal) / Number(divisor);

  // Check last update date
  const lastUpdatedAt = new Date(usdPrice.lastUpdatedAt);
  const minLastUpdatedAt = new Date(
    Date.now() - alchemyConfig.usdPriceActualityTime
  );
  if (lastUpdatedAt < minLastUpdatedAt) {
    return undefined;
  }

  // Calculate USD value
  const usdPriceValue = parseFloat(usdPrice.value);
  const usdValue = actualAmount * usdPriceValue;

  // Check that USD value is not too high
  if (usdValue > alchemyConfig.maxUsdValue) {
    return undefined;
  }

  return usdValue;
}

export async function getTokensByWallet(
  address: string
): Promise<AlchemyToken[]> {
  logger.info(`[Alchemy] Getting tokens by wallet for ${address}`);

  let totalTokens: AlchemyToken[] = [];
  let iterationPageKey: string | undefined | null = undefined;
  let iterationCount = 0;

  do {
    // Get tokens with the current cursor
    const { data } = await axios.post(
      `https://api.g.alchemy.com/data/v1/${process.env.ALCHEMY_API_KEY}/assets/tokens/by-address`,
      {
        addresses: [
          {
            address: address,
            networks: "base-mainnet",
          },
        ],
        ...(iterationPageKey ? { pageKey: iterationPageKey } : {}),
      }
    );

    const response: {
      data: { tokens: AlchemyToken[]; pageKey: string | null };
    } = data;

    // Add tokens to the total collection
    totalTokens = totalTokens.concat(response.data.tokens);

    // Update page key for next iteration
    iterationPageKey = response.data.pageKey;

    // Increment iteration count
    iterationCount++;

    // Wait to avoid hitting API rate limits
    await new Promise((resolve) => setTimeout(resolve, alchemyConfig.delay));

    logger.info(
      `[Alchemy] Got ${response.data.tokens.length} tokens. Total: ${totalTokens.length}. Iteration: ${iterationCount}`
    );
  } while (iterationPageKey && iterationCount < alchemyConfig.maxIterations);

  return totalTokens;
}

export function getTokensUsdValue(tokens: AlchemyToken[]): number {
  let tokensUsdValue = 0;
  for (const token of tokens) {
    const tokenUsdValue = getTokenUsdValue(token);
    if (tokenUsdValue) {
      tokensUsdValue += tokenUsdValue;
    }
  }
  return tokensUsdValue;
}
