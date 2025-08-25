import axios from "axios";
import { AlchemyToken } from "../types/alchemy-token";
import { logger } from "./logger";

export async function getTokensByWallet(
  address: string
): Promise<AlchemyToken[]> {
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
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  logger.info(`[Alchemy] Data: ${JSON.stringify(data)}`);

  const tokens: AlchemyToken[] = data.data.tokens;
  return tokens;
}
