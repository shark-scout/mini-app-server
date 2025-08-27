import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Follower } from "@neynar/nodejs-sdk/build/api";
import { neynarConfig } from "../config/neynar";
import { logger } from "./logger";

// TODO: Add try-catch
export async function fetchUserFollowers(fid: number): Promise<Follower[]> {
  logger.info(`[Neynar] Fetching user followers for ${fid}...`);

  const config = new Configuration({
    apiKey: process.env.NEYNAR_API_KEY as string,
  });
  const client = new NeynarAPIClient(config);

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
