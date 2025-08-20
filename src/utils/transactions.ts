import { Transaction } from "../mongodb/models/transaction";
import { insertTransactions } from "../mongodb/services/transactions";
import { logger } from "./logger";
import { getListOfWalletTransactions } from "./zerion";

// TODO: Add timeout between sending requests
export async function createTransactions(
  addresses: string[],
  minMinedAt: number
): Promise<void> {
  logger.info(`Creating transactions for ${addresses.length} addresses`);
  for (const address of addresses) {
    logger.info(`Creating transactions for address: ${address}`);
    // Get transactions from Zerion API
    const zerionTransactions = await getListOfWalletTransactions(
      address,
      minMinedAt
    );
    // Map Zerion transactions to internal Transaction model
    const transactions: Transaction[] = zerionTransactions.map((zt) => ({
      created: new Date(),
      address: address,
      zerionTransaction: zt,
    }));
    logger.info(
      `Created ${transactions.length} transactions for address: ${address}`
    );
    // Insert transactions into MongoDB
    if (transactions.length > 0) {
      await insertTransactions(transactions);
    }
  }
}
