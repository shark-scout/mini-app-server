import { Transaction } from "../mongodb/models/transaction";
import { Trend } from "../mongodb/models/trend";
import { insertTrends } from "../mongodb/services/trends";
import { logger } from "./logger";

export async function createTrends(transactions: Transaction[]) {
  logger.info("Creating trends...");

  const trends: Trend[] = [];

  // Map to group trends by token address and type (buy/sell)
  const trendMap = new Map<
    string,
    {
      type: "buy" | "sell";
      token: {
        address: string;
        name: string;
        symbol: string;
        icon: string;
      };
      transactions: {
        hash: string;
        value: number;
      }[];
      users: {
        address: string;
      }[];
      value: number;
    }
  >();

  // Process each transaction
  for (const transaction of transactions) {
    const { transfers } = transaction.zerionTransaction.attributes;
    const transactionHash = transaction.zerionTransaction.attributes.hash;
    const userAddress = transaction.address;

    // Process each transfer in the transaction
    for (const transfer of transfers) {
      const { direction, fungible_info, value } = transfer;

      // Skip if no fungible info (shouldn't happen but safety check)
      if (!fungible_info) continue;

      // Determine trend type based on direction
      const trendType: "buy" | "sell" = direction === "in" ? "buy" : "sell";

      // Create unique key for this token and trend type
      const trendKey = `${
        fungible_info.implementations[0]?.address || fungible_info.id
      }-${trendType}`;

      // Get or create trend data
      let trendData = trendMap.get(trendKey);

      if (!trendData) {
        trendData = {
          type: trendType,
          token: {
            address:
              fungible_info.implementations[0]?.address || fungible_info.id,
            name: fungible_info.name,
            symbol: fungible_info.symbol,
            icon: fungible_info.icon?.url || "",
          },
          transactions: [],
          users: [],
          value: 0,
        };
        trendMap.set(trendKey, trendData);
      }

      // Add transaction info
      trendData.transactions.push({
        hash: transactionHash,
        value: value,
      });

      // Add user if not already present
      if (!trendData.users.find((user) => user.address === userAddress)) {
        trendData.users.push({ address: userAddress });
      }

      // Accumulate total value
      trendData.value += value;
    }
  }

  // Convert map to Trend objects
  const currentTime = new Date();
  for (const trendData of trendMap.values()) {
    const trend = new Trend(
      currentTime,
      trendData.type,
      trendData.token,
      trendData.transactions,
      trendData.users,
      trendData.value
    );
    trends.push(trend);
  }

  logger.info(
    `Created ${trends.length} trends from ${transactions.length} transactions`
  );

  // Insert trends into MongoDB
  await insertTrends(trends);
}
