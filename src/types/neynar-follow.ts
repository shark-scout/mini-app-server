import { NeynarUser } from "./neynar-user";

export type NeynarFollow = {
  object: "follow";
  app: { fid: string };
  user: NeynarUser;
};
