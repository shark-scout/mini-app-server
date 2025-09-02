import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Follower, User } from "@neynar/nodejs-sdk/build/api";
import { neynarConfig } from "../config/neynar";
import { logger } from "./logger";

const configPrimary = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY_PRIMARY as string,
  baseOptions: {
    headers: {
      "x-neynar-experimental": neynarConfig.experimental,
    },
  },
});

const configSecondary = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY_SECONDARY as string,
  baseOptions: {
    headers: {
      "x-neynar-experimental": neynarConfig.experimental,
    },
  },
});

export async function fetchUser(fid: number): Promise<User | undefined> {
  logger.info(`[Neynar] Fetching user info for ${fid}...`);

  const client = new NeynarAPIClient(configSecondary);
  const response = await client.fetchBulkUsers({ fids: [fid] });
  return response.users[0];
}

export async function fetchUserFollowers(fid: number): Promise<Follower[]> {
  logger.info(`[Neynar] Fetching user followers for ${fid}...`);

  const client = new NeynarAPIClient(configSecondary);

  let totalFollowers: Follower[] = [];
  let iterationCursor: string | undefined | null = undefined;
  let iterationCount = 0;

  do {
    // Fetch followers with the current cursor
    const response = await client.fetchUserFollowers({
      fid,
      ...(iterationCursor ? { cursor: iterationCursor } : {}),
      limit: neynarConfig.limit,
    });

    // Add followers to the total collection
    totalFollowers = totalFollowers.concat(response.users);

    // Update cursor for next iteration
    iterationCursor = response.next.cursor;

    // Increment iteration count
    iterationCount++;

    // Wait to avoid hitting API rate limits
    await new Promise((resolve) => setTimeout(resolve, neynarConfig.delay));

    logger.info(
      `[Neynar] Fetched ${response.users.length} followers. Total: ${totalFollowers.length}. Iteration: ${iterationCount}`
    );
  } while (iterationCursor && iterationCount < neynarConfig.maxIterations);

  return totalFollowers;
}

export async function sendNotification(
  fid: number,
  title: string,
  body: string,
  targetUrl: string
): Promise<string> {
  logger.info(`[Neynar] Sending notification to ${fid}...`);

  const client = new NeynarAPIClient(configPrimary);

  const response = await client.publishFrameNotifications({
    targetFids: [fid],
    notification: {
      title: title,
      body: body,
      target_url: targetUrl,
    },
  });
  if (response.notification_deliveries.length === 0) {
    return "not_sent";
  }
  return response.notification_deliveries
    .map((delivery) => delivery.status)
    .join(", ");
}
