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
  logger.info(`[Utils] Creating dashboard for FID: ${fid}`);

  // Check if there are any histories to process
  if (histories.length === 0) {
    logger.warn(`[Utils] No histories for creating dashboard`);
    return;
  }

  // Create a map to group users by their eth addresses
  const addressToUserMap = new Map<string, NeynarUser>();
  for (const user of users) {
    for (const ethAddress of user.verified_addresses.eth_addresses) {
      addressToUserMap.set(ethAddress.toLowerCase(), user);
    }
  }

  // Create a map to group trends by token address and type (buy/sell)
  const trendKeyToTrendMap = new Map<string, Trend>();

  // Process each transaction in each history
  for (const history of histories) {
    for (const zerionTransaction of history.zerionTransactions) {
      const { transfers } = zerionTransaction.attributes;
      const transactionHash = zerionTransaction.attributes.hash;
      const userAddress = history.address;

      // Find the user for this transaction address
      const user = addressToUserMap.get(userAddress.toLowerCase());
      if (!user) {
        logger.warn(`[Utils] No user found for address: ${userAddress}`);
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
          address: history.address,
          hash: transactionHash,
          value: value,
        });

        // Add user if not already present (check by FID to prevent duplicates)
        if (!trend.users.find((u) => u.fid === user.fid)) {
          trend.users.push({
            fid: user.fid,
            username: user.username,
            pfp_url: user.pfp_url,
            addresses: user.verified_addresses.eth_addresses,
          });
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
  logger.info(`[Utils] Created ${trends.length} trends for dashboard`);

  // Insert dashboard into MongoDB
  const dashboard: Dashboard = {
    created: new Date(),
    fid,
    trends,
  };
  await insertDashboard(dashboard);
}
