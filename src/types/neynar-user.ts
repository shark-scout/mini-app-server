export type NeynarUser = {
  object: "user";
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  pro?: {
    status: "subscribed" | "unsubscribed";
    subscribed_at: string;
    expires_at: string;
  };
  profile: {
    bio: {
      text: string;
      mentioned_profiles?: {
        object: "user_dehydrated";
        fid: number;
        username: string;
        display_name: string;
        pfp_url: string;
        custody_address: string;
      }[];
      mentioned_profiles_ranges?: {
        start: number;
        end: number;
      }[];
      mentioned_channels?: {
        object: string;
        id: string;
        name: string;
        image_url: string;
      }[];
      mentioned_channels_ranges?: {
        start: number;
        end: number;
      }[];
    };
    banner?: {
      url: string;
    };
    location?: {
      latitude: number;
      longitude: number;
      address?: {
        city: string;
        state?: string;
        state_code?: string;
        country: string;
        country_code: string;
      };
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
    primary: {
      eth_address: string | null;
      sol_address: string | null;
    };
  };
  auth_addresses: Array<{
    address: string;
    app: {
      object: "user_dehydrated";
      fid: number;
    };
  }>;
  verified_accounts: Array<{
    platform: string;
    username: string;
  }>;
  power_badge: boolean;
  url?: string;
  experimental: {
    neynar_user_score: number;
    deprecation_notice: string;
  };
  score: number;
};
