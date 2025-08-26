type TokenMetadata = {
  symbol: string | null;
  decimals: number | null;
  name: string | null;
  logo: string | null;
};

type TokenPrice = {
  currency: string;
  value: string;
  lastUpdatedAt: string;
};

export type AlchemyToken = {
  address: string;
  network: string;
  tokenAddress: string | null;
  tokenBalance: string;
  tokenMetadata: TokenMetadata;
  tokenPrices: TokenPrice[];
};
