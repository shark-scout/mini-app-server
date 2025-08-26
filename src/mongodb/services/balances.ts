import { mongodbConfig } from "../../config/mongodb";
import { logger } from "../../utils/logger";
import { Balance } from "../models/balance";
import { getCollection } from "./collections";

export async function findBalances(args?: {
  address?: string;
  addresses?: string[];
}): Promise<Balance[]> {
  logger.info("[MongoDB] Finding balances...");
  const collection = await getCollection<Balance>(
    mongodbConfig.collections.balances
  );
  const balances = await collection
    .find({
      ...(args?.address !== undefined && { address: args.address }),
      ...(args?.addresses !== undefined && {
        address: { $in: args.addresses },
      }),
    })
    .sort({ createdAt: -1 })
    .toArray();
  return balances;
}

export async function insertBalance(balance: Balance): Promise<void> {
  logger.info("[MongoDB] Inserting balance...");
  const collection = await getCollection<Balance>(
    mongodbConfig.collections.balances
  );
  await collection.insertOne(balance);
}
