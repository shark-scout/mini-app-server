import { NeynarUser } from "../types/neynar-user";
import { logger } from "./logger";

// TODO: Implement
export async function fetchUserFollowing(fid: number): Promise<NeynarUser[]> {
  logger.info(`[Neynar] Fetching following for user ${fid}`);
  return [];
}
