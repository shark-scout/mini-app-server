import { Transaction } from "../mongodb/models/transaction";
import { insertTransactions } from "../mongodb/services/transactions";
import { logger } from "./logger";
import { getListOfWalletTransactions } from "./zerion";

export async function createTransactions(
  addresses: string[],
  minMinedAt: number
): Promise<void> {
  logger.info("Creating transactions...");
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
    // Insert transactions into MongoDB
    await insertTransactions(transactions);
  }
}
