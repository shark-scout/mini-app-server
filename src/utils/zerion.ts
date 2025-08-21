import axios from "axios";
import { ZerionTransaction } from "../types/zerion-transaction";
import { logger } from "./logger";

export async function getListOfWalletTransactions(
  address: string,
  minMinedAt: number,
  maxMinedAt: number
): Promise<ZerionTransaction[]> {
  logger.info(`Getting list of wallet transactions...`);

  const { data } = await axios.get(
    `https://api.zerion.io/v1/wallets/${address}/transactions/` +
      `?currency=usd` +
      `&page[size]=100` +
      `&filter[operation_types]=trade` +
      `&filter[asset_types]=fungible` +
      `&filter[chain_ids]=base` +
      `&filter[min_mined_at]=${minMinedAt}` +
      `&filter[max_mined_at]=${maxMinedAt}` +
      `&filter[trash]=no_filter`,
    {
      headers: {
        accept: "application/json",
        authorization: `Basic ${process.env.ZERION_API_KEY}`,
      },
    }
  );

  const transactions: ZerionTransaction[] = data.data;
  return transactions;
}
