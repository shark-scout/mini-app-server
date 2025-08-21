import { mongodbConfig } from "../../config/mongodb";
import { logger } from "../../utils/logger";
import { History } from "../models/history";
import { getCollection } from "./collections";

export async function findHistories(args?: {
  address?: string;
  minMinedAt?: Date;
  maxMinedAt?: Date;
}): Promise<History[]> {
  logger.info("[MongoDB] Finding histories...");
  const collection = await getCollection<History>(
    mongodbConfig.collections.histories
  );
  const histories = await collection
    .find({
      ...(args?.address !== undefined && { address: args.address }),
      ...(args?.minMinedAt !== undefined && { minMinedAt: args.minMinedAt }),
      ...(args?.maxMinedAt !== undefined && { maxMinedAt: args.maxMinedAt }),
    })
    .sort({ created: -1 })
    .toArray();
  return histories;
}

export async function insertHistory(history: History): Promise<void> {
  logger.info("[MongoDB] Inserting history...");
  const collection = await getCollection<History>(
    mongodbConfig.collections.histories
  );
  await collection.insertOne(history);
}
