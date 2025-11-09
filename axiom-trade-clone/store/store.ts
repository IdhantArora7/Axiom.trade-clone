export interface TokenData {
  id: string;
  name: string;
  ticker: string;
  iconUrl: string;
  age: string;
  socials: {
    twitter?: string;
    telegram?: string;
    website?: string;
  };
  marketCap: {
    value: number;
    changePercent: number;
    sparklineData: number[];
  };
  liquidity: number;
  volume: number;
  transactions: {
    total: number;
    buys: number;
    sells: number;
  };
  tokenInfo: {
    metricA: number;
    metricB: number;
    holderCount: number;
    teamAllocation: number;
    status: 'Paid' | 'Unpaid';
  };
}

