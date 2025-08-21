import { History } from "../mongodb/models/history";
import { Trend } from "../mongodb/models/trend";
import { insertTrends } from "../mongodb/services/trends";
import { NeynarUser } from "../types/neynar-user";
import { logger } from "./logger";

export async function createTrends(histories: History[], users: NeynarUser[]) {
  logger.info("Creating trends...");

  const trends: Trend[] = [];

  // Create a map from eth addresses to user fids for quick lookup
  const addressToFidMap = new Map<string, number>();
  for (const user of users) {
    for (const ethAddress of user.verified_addresses.eth_addresses) {
      addressToFidMap.set(ethAddress.toLowerCase(), user.fid);
    }
  }

  // Map to group trends by token address and type (buy/sell)
  const trendKeyToDataMap = new Map<
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
        fid: number;
      }[];
      value: number;
    }
  >();

  // Process each transaction in each history
  for (const history of histories) {
    for (const zerionTransaction of history.zerionTransactions) {
      const { transfers } = zerionTransaction.attributes;
      const transactionHash = zerionTransaction.attributes.hash;
      const userAddress = history.address;

      // Find the user fid for this transaction address
      const userFid = addressToFidMap.get(userAddress.toLowerCase());
      if (!userFid) {
        logger.warn(`No user found for address: ${userAddress}`);
        continue; // Skip transactions for users not in our Neynar user list
      }

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
        let trendData = trendKeyToDataMap.get(trendKey);

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
          trendKeyToDataMap.set(trendKey, trendData);
        }

        // Add transaction info
        trendData.transactions.push({
          hash: transactionHash,
          value: value,
        });

        // Add user if not already present (check by fid to prevent duplicates)
        if (!trendData.users.find((user) => user.fid === userFid)) {
          trendData.users.push({ fid: userFid });
        }

        // Accumulate total value
        trendData.value += value;
      }
    }
  }

  // Convert map to Trend objects
  const currentTime = new Date();
  for (const trendData of trendKeyToDataMap.values()) {
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

  logger.info(`Created ${trends.length} trends`);

  // Insert trends into MongoDB
  await insertTrends(trends);
}
