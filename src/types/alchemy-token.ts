interface TokenMetadata {
  symbol: string | null;
  decimals: number | null;
  name: string | null;
  logo: string | null;
}

interface TokenPrice {
  currency: string;
  value: string;
  lastUpdatedAt: string;
}

export interface AlchemyToken {
  address: string;
  network: string;
  tokenAddress: string | null;
  tokenBalance: string;
  tokenMetadata: TokenMetadata;
  tokenPrices: TokenPrice[];
}
