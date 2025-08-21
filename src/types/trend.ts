export type Trend = {
  type: "buy" | "sell";
  token: {
    address: string;
    name: string;
    symbol: string;
    icon: string;
  };
  transactions: {
    hash: string;
    value: number;
  }[];
  users: {
    fid: number;
  }[];
  value: number;
};
