import { mongodbConfig } from "../../config/mongodb";
import { logger } from "../../utils/logger";
import { Transaction } from "../models/transaction";
import { getCollection } from "./collections";

export async function findTransactions(args?: {
  address?: string;
}): Promise<Transaction[]> {
  logger.info("Finding transactions...");
  const collection = await getCollection<Transaction>(
    mongodbConfig.collections.transactions
  );
  const transactions = await collection
    .find({
      ...(args?.address !== undefined && { address: args.address }),
    })
    .sort({ created: -1 })
    .toArray();
  return transactions;
}

// TODO: Don't insert transaction with duplicate hash
export async function insertTransactions(
  transactions: Transaction[]
): Promise<void> {
  logger.info("Inserting transactions...");
  const collection = await getCollection<Transaction>(
    mongodbConfig.collections.transactions
  );
  await collection.insertMany(transactions);
}
