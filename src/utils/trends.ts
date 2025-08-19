import { demoUsers } from "../demo/users";
import { Trend } from "../types/trend";
import { ZerionTransaction } from "../types/zerion-transaction";
import { logger } from "./logger";
import { getListOfWalletTransactions } from "./zerion";

export async function createTrends(fid: number) {
  logger.info("Creating trends...");

  // TODO: Load users using Neynar
  // TODO: Save users in database
  const users = demoUsers;

  const userTransactions: {
    address: string;
    transactions: ZerionTransaction[];
  }[] = [];
  for (const user of users) {
    for (const address of user.verified_addresses.eth_addresses) {
      const transactions = await getListOfWalletTransactions(address);
      // TODO: Save transactions in database
      userTransactions.push({ address: address, transactions: transactions });
    }
  }

  const trends: Trend[] = [];
  // TODO: Save trends in database

  logger.info("Trends created");
}
