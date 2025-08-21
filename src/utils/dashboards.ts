import { Dashboard } from "../mongodb/models/dashboard";
import { History } from "../mongodb/models/history";
import { insertDashboard } from "../mongodb/services/dashboards";
import { NeynarUser } from "../types/neynar-user";
import { Trend } from "../types/trend";
import { logger } from "./logger";

export async function createDashboard(
  fid: number,
  histories: History[],
  users: NeynarUser[]
) {
  logger.info(`Creating dashboard for FID: ${fid}`);

  // Create a map from eth addresses to user fids for quick lookup
  const addressToFidMap = new Map<string, number>();
  for (const user of users) {
    for (const ethAddress of user.verified_addresses.eth_addresses) {
      addressToFidMap.set(ethAddress.toLowerCase(), user.fid);
    }
  }

  // Map to group trends by token address and type (buy/sell)
  const trendKeyToTrendMap = new Map<string, Trend>();

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
        continue; // Skip transactions for users not in our user list
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

        // Get or create trend
        let trend = trendKeyToTrendMap.get(trendKey);

        if (!trend) {
          trend = {
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
          trendKeyToTrendMap.set(trendKey, trend);
        }

        // Add transaction info
        trend.transactions.push({
          hash: transactionHash,
          value: value,
        });

        // Add user if not already present (check by fid to prevent duplicates)
        if (!trend.users.find((user) => user.fid === userFid)) {
          trend.users.push({ fid: userFid });
        }

        // Accumulate total value
        trend.value += value;
      }
    }
  }

  // Convert map to array
  const trends: Trend[] = [];
  for (const trend of trendKeyToTrendMap.values()) {
    trends.push(trend);
  }

  // Insert dashboard into MongoDB
  const dashboard: Dashboard = {
    created: new Date(),
    fid,
    trends,
  };
  await insertDashboard(dashboard);
}
