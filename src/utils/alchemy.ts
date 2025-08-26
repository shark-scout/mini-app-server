import axios from "axios";
import { AlchemyToken } from "../types/alchemy-token";
import { logger } from "./logger";

export async function getTokensByWallet(
  address: string,
  pageKey?: string
): Promise<{
  tokens: AlchemyToken[];
  pageKey: string | undefined;
}> {
  logger.info(`[Alchemy] Getting tokens by wallet...`);

  const { data } = await axios.post(
    `https://api.g.alchemy.com/data/v1/${process.env.ALCHEMY_API_KEY}/assets/tokens/by-address`,
    {
      addresses: [
        {
          address: address,
          networks: ["base-mainnet"],
        },
      ],
      ...(pageKey && { pageKey: pageKey }),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return { tokens: data.data.tokens, pageKey: data.data.pageKey };
}

export function getTokenUsdValue(token: AlchemyToken): number | undefined {
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
  if (decimals === null || decimals === undefined) {
    return undefined;
  }

  // Calculate actual token amount
  const divisor = BigInt(10 ** decimals);
  const actualAmount = Number(balanceDecimal) / Number(divisor);

  // Calculate USD value
  const priceValue = parseFloat(usdPrice.value);
  const usdValue = actualAmount * priceValue;

  return usdValue;
}
