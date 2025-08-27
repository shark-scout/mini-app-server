import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Follower } from "@neynar/nodejs-sdk/build/api";
import { neynarConfig } from "../config/neynar";
import { logger } from "./logger";

// TODO: Add try-catch
export async function fetchUserFollowers(fid: number): Promise<Follower[]> {
  logger.info(`[Neynar] Fetching user followers for FID ${fid}...`);

  const config = new Configuration({
    apiKey: process.env.NEYNAR_API_KEY as string,
  });
  const client = new NeynarAPIClient(config);

  let totalFollowers: Follower[] = [];
  let iterationCursor: string | undefined | null = undefined;
  let iterationCount = 0;

  do {
    // Fetch followers with the current cursor
    const followersResponse = await client.fetchUserFollowers({
      fid,
      ...(iterationCursor ? { cursor: iterationCursor } : {}),
      limit: neynarConfig.limit,
    });

    // Add followers to the total collection
    totalFollowers = totalFollowers.concat(followersResponse.users);

    // Update cursor for next iteration
    iterationCursor = followersResponse.next.cursor;

    // Increment iteration count
    iterationCount++;

    // Wait to avoid hitting API rate limits
    await new Promise((resolve) => setTimeout(resolve, neynarConfig.delay));

    logger.info(
      `[Neynar] Fetched ${followersResponse.users.length} followers. Total: ${totalFollowers.length}. Iteration: ${iterationCount}`
    );
  } while (iterationCursor && iterationCount < neynarConfig.maxIterations);

  return totalFollowers;
}
