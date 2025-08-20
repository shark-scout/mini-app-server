import { mongodbConfig } from "../../config/mongodb";
import { logger } from "../../utils/logger";
import { Trend } from "../models/trend";
import { getCollection } from "./collections";

export async function insertTrends(trends: Trend[]): Promise<void> {
  logger.info("Inserting trends...");
  const collection = await getCollection<Trend>(
    mongodbConfig.collections.trends
  );
  await collection.insertMany(trends);
}
