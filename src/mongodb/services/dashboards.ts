import { mongodbConfig } from "../../config/mongodb";
import { logger } from "../../utils/logger";
import { Dashboard } from "../models/dashboard";
import { getCollection } from "./collections";

export async function insertDashboard(dashboard: Dashboard): Promise<void> {
  logger.info("[MongoDB] Inserting dashboard...");
  const collection = await getCollection<Dashboard>(
    mongodbConfig.collections.dashboards
  );
  await collection.insertOne(dashboard);
}
