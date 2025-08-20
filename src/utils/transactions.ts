import { Transaction } from "../mongodb/models/transaction";
import { insertTransactions } from "../mongodb/services/transactions";
import { logger } from "./logger";
import { getListOfWalletTransactions } from "./zerion";

// TODO: Handle 500 error
export async function createTransactions(
  addresses: string[],
  minMinedAt: number
): Promise<void> {
  logger.info(`Creating transactions for ${addresses.length} addresses`);
  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    if (!address) {
      continue;
    }
    logger.info(
      `Creating transactions for address: ${address}, ${i + 1}/${
        addresses.length
      }`
    );
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
    // Wait to avoid hitting API rate limits
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}
