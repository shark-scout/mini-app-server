import { NeynarUser } from "./neynar-user";

export type NeynarMember = {
  object: "member";
  role: "member" | "moderator";
  user: NeynarUser;
  channel: {
    object: string;
    id: string;
    name: string;
    image_url: string;
  };
};
