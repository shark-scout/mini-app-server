import { NeynarFollow } from "../types/neynar-follow";

export const demoNeynarFollowsOne: NeynarFollow[] = [
  {
    object: "follow",
    app: { fid: "9152" },
    user: {
      object: "user",
      fid: 1734,
      username: "flynn.eth",
      display_name: "Brian Flynn",
      pfp_url: "https://i.imgur.com/v4qxohE.jpg",
      custody_address: "0x4355c93bf1f7c6c0b2d38bc9b2349cb266bcd0b5",
      pro: {
        status: "subscribed",
        subscribed_at: "2025-06-16T17:19:43.000Z",
        expires_at: "2026-06-16T17:19:43.000Z",
      },
      profile: {
        bio: {
          text: "building @dau and @boostxyz to help mini app devs grow onchain with token incentives. prev dapper, opensea",
          mentioned_profiles: [
            {
              object: "user_dehydrated",
              fid: 1110131,
              username: "dau",
              display_name: "DAILY ACTIVE USER",
              pfp_url:
                "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/59bc7b91-ac53-4174-2967-911534328c00/original",
              custody_address: "0xe36cd47ebff44c63e9600aaeda4f125161ac3ed2",
            },
            {
              object: "user_dehydrated",
              fid: 249078,
              username: "boostxyz",
              display_name: "Boost",
              pfp_url: "https://i.imgur.com/FTch4Oj.jpg",
              custody_address: "0xe58c9cd614038bed65fa8476d61ac049b2d0b2e7",
            },
          ],
          mentioned_profiles_ranges: [
            {
              start: 9,
              end: 13,
            },
            {
              start: 18,
              end: 27,
            },
          ],
        },
      },
      follower_count: 7879,
      following_count: 380,
      verifications: [
        "0x565b93a15d38acd79c120b15432d21e21ed274d6",
        "0x6535c0315b9668a3e38dfcaeee102705d0a74741",
      ],
      verified_addresses: {
        eth_addresses: [
          "0x565b93a15d38acd79c120b15432d21e21ed274d6",
          "0x6535c0315b9668a3e38dfcaeee102705d0a74741",
        ],
        sol_addresses: ["HLqCJnLsrebKBwmtKrrBteeMkE7YVrheG5Ypf2iFhpcx"],
        primary: {
          eth_address: "0x6535c0315b9668a3e38dfcaeee102705d0a74741",
          sol_address: "HLqCJnLsrebKBwmtKrrBteeMkE7YVrheG5Ypf2iFhpcx",
        },
      },
      auth_addresses: [
        {
          address: "0x3e27b42ebbaefdb3c5dd59d87ac003a5f3fe4872",
          app: {
            object: "user_dehydrated",
            fid: 309857,
          },
        },
        {
          address: "0x6535c0315b9668a3e38dfcaeee102705d0a74741",
          app: {
            object: "user_dehydrated",
            fid: 9152,
          },
        },
      ],
      verified_accounts: [
        {
          platform: "x",
          username: "flynnjamm",
        },
      ],
      power_badge: true,
      experimental: {
        neynar_user_score: 0.99,
        deprecation_notice:
          "The `neynar_user_score` field under `experimental` will be deprecated after June 1, 2025, as it will be formally promoted to a stable field named `score` within the user object.",
      },
      score: 0.99,
    },
  },
  {
    object: "follow",
    app: { fid: "9152" },
    user: {
      object: "user",
      fid: 18763,
      username: "runn3rr",
      display_name: "↑🎩runn3rr.eth",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/459ce7f6-0e80-43eb-224a-fdc1c47cb600/original",
      custody_address: "0x1d675aefa52ba004081c895e0a54589bc8d9bebc",
      pro: {
        status: "subscribed",
        subscribed_at: "2025-06-16T17:17:41.000Z",
        expires_at: "2026-06-16T17:17:41.000Z",
      },
      profile: {
        bio: {
          text: "Farcaster, since 2023 ↑↑↑\nPing Network Social Lead ↑↑↑ \n\nAny of my casts are not financial advices",
        },
      },
      follower_count: 13492,
      following_count: 1835,
      verifications: [
        "0x1d2e44dede73dcf080104ec0839a70da14641762",
        "0xb127a792c83a72e6d961df9e41a5e414e22d80ba",
      ],
      verified_addresses: {
        eth_addresses: [
          "0x1d2e44dede73dcf080104ec0839a70da14641762",
          "0xb127a792c83a72e6d961df9e41a5e414e22d80ba",
        ],
        sol_addresses: [
          "3bK6amMuMVooeoQ1mEQKfjumQ3iUQ4CRqy9DRGzTXb6h",
          "HnVBydbjkju2mpUPyu8YpFSaGneHcKWp2juSy4XFkeWp",
        ],
        primary: {
          eth_address: "0xb127a792c83a72e6d961df9e41a5e414e22d80ba",
          sol_address: "HnVBydbjkju2mpUPyu8YpFSaGneHcKWp2juSy4XFkeWp",
        },
      },
      auth_addresses: [
        {
          address: "0xb127a792c83a72e6d961df9e41a5e414e22d80ba",
          app: {
            object: "user_dehydrated",
            fid: 9152,
          },
        },
      ],
      verified_accounts: [
        {
          platform: "x",
          username: "runn3rrr",
        },
      ],
      power_badge: true,
      experimental: {
        neynar_user_score: 1,
        deprecation_notice:
          "The `neynar_user_score` field under `experimental` will be deprecated after June 1, 2025, as it will be formally promoted to a stable field named `score` within the user object.",
      },
      score: 1,
    },
  },
];
