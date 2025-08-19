import { mongodbConfig } from "../../config/mongodb";
import { logger } from "../../utils/logger";
import { Transaction } from "../models/transaction";
import { getCollection } from "./collections";

export async function insertTransactions(
  transactions: Transaction[]
): Promise<void> {
  logger.info("Inserting transactions");
  const collection = await getCollection<Transaction>(
    mongodbConfig.collections.transactions
  );
  await collection.insertMany(transactions);
}
