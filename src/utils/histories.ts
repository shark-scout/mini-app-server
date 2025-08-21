import { History } from "../mongodb/models/history";
import { findHistories, insertHistory } from "../mongodb/services/histories";
import { logger } from "./logger";
import { getListOfWalletTransactions } from "./zerion";

export async function createHistories(
  addresses: string[],
  minMinedAt: Date,
  maxMinedAt: Date
): Promise<void> {
  logger.info(`Creating histories for ${addresses.length} addresses`);
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    if (!address) {
      continue;
    }
    logger.info(
      `Creating history for address: ${address}, ${i + 1}/${addresses.length}`
    );
    // Check if history already exists
    const histories = await findHistories({ address, minMinedAt, maxMinedAt });
    if (histories.length !== 0) {
      logger.info("History already exists");
      continue;
    }
    // Get transactions from Zerion API
    const zerionTransactions = await getListOfWalletTransactions(
      address,
      minMinedAt.getTime(),
      maxMinedAt.getTime()
    );
    logger.info(
      `Retrieved ${zerionTransactions.length} transactions from Zerion API`
    );
    // Insert history into MongoDB
    const history: History = {
      created: new Date(),
      address: address,
      zerionTransactions: zerionTransactions,
      minMinedAt: minMinedAt,
      maxMinedAt: maxMinedAt,
    };
    await insertHistory(history);
    // Wait to avoid hitting Zerion API rate limits
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}
