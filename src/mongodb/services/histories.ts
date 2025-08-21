import { mongodbConfig } from "../../config/mongodb";
import { logger } from "../../utils/logger";
import { History } from "../models/history";
import { getCollection } from "./collections";

export async function findHistories(args?: {
  address?: string;
}): Promise<History[]> {
  logger.info("Finding histories...");
  const collection = await getCollection<History>(
    mongodbConfig.collections.histories
  );
  const histories = await collection
    .find({
      ...(args?.address !== undefined && { address: args.address }),
    })
    .sort({ created: -1 })
    .toArray();
  return histories;
}

export async function insertHistory(history: History): Promise<void> {
  logger.info("Inserting history...");
  const collection = await getCollection<History>(
    mongodbConfig.collections.histories
  );
  await collection.insertOne(history);
}
