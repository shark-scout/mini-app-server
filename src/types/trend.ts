export type Trend = {
  token: {
    symbol: string;
    address: string;
    logo: string | null;
  };
  transactions: {
    hash: string;
    valueFormatted: string;
  }[];
  users: {
    fid: number;
    username: string;
    pfp_url: string;
  }[];
  volume?: {
    usd: number;
  };
};
