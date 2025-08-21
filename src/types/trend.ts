export type Trend = {
  type: "buy" | "sell";
  token: {
    address: string;
    name: string;
    symbol: string;
    icon: string;
  };
  transactions: {
    address: string; // User's address
    hash: string;
    value: number;
  }[];
  users: {
    fid: number;
    username: string;
    pfp_url: string;
    addresses: string[];
  }[];
  value: number;
};
