import { NeynarUser } from "../types/neynar-user";

export const demoFollowingUsers: NeynarUser[] = [
  {
    object: "user",
    fid: 509000,
    username: "annaan",
    display_name: "CharmFox",
    pfp_url:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/4afbc344-3137-40d7-a335-8473631b5300/rectcrop3",
    custody_address: "0xdf7b9fee7c75ab0d09e03ce0c873b68a449e0c96",
    pro: {
      status: "subscribed",
      subscribed_at: "2025-06-16T17:18:25.000Z",
      expires_at: "2026-06-16T17:18:25.000Z",
    },
    profile: {
      bio: {
        text: "Designer creating user-friendly interfaces. Passionate about travel and discovery. Let's enjoy life together!✨",
      },
    },
    follower_count: 460,
    following_count: 430,
    verifications: [
      "0x9121e6787857bdfafe4f31de6d8674a82aa49b64",
      "0x935de2ed41969dc302f9fca489cfcadf17065e85",
    ],
    verified_addresses: {
      eth_addresses: [
        "0x9121e6787857bdfafe4f31de6d8674a82aa49b64",
        "0x935de2ed41969dc302f9fca489cfcadf17065e85",
      ],
      sol_addresses: ["9gfsVPckhXe2XCmwDM1PhCsoFirm77oQwEH6kihpkeP4"],
      primary: {
        eth_address: "0x935de2ed41969dc302f9fca489cfcadf17065e85",
        sol_address: "9gfsVPckhXe2XCmwDM1PhCsoFirm77oQwEH6kihpkeP4",
      },
    },
    auth_addresses: [
      {
        address: "0x935de2ed41969dc302f9fca489cfcadf17065e85",
        app: { object: "user_dehydrated", fid: 9152 },
      },
    ],
    verified_accounts: [{ platform: "x", username: "charmfoxy" }],
    power_badge: true,
    experimental: {
      neynar_user_score: 0.9,
      deprecation_notice:
        "The `neynar_user_score` field under `experimental` will be deprecated after June 1, 2025, as it will be formally promoted to a stable field named `score` within the user object.",
    },
    score: 0.9,
  },
];
