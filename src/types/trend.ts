export type Trend = {
  type: "buy" | "sell";
  token: {
    address: string;
    name: string;
    symbol: string;
    icon: string;
  };
  // TODO: Add address
  transactions: {
    hash: string;
    value: number;
  }[];
  users: {
    fid: number;
    username: string;
    pfp_url: string;
  }[];
  value: number;
};
