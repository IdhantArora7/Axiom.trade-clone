import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenData } from '@/types/token';

// This interface defines the shape of our dynamic, real-time data
interface DynamicTokenData {
  marketCap: number;
  liquidity: number;
  volume: number;
  sparklineData: number[];
}

interface PriceUpdatePayload {
  id: string;
  data: DynamicTokenData;
}

interface TokenState {
  dynamicData: Record<string, DynamicTokenData>;
}

const initialState: TokenState = {
  dynamicData: {},
};

export const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    // Action to initialize the store once tokens are fetched
    setInitialTokenData: (state, action: PayloadAction<TokenData[]>) => {
      const initialData: Record<string, DynamicTokenData> = {};
      action.payload.forEach(token => {
        initialData[token.id] = {
          marketCap: token.marketCap.value,
          liquidity: token.liquidity,
          volume: token.volume,
          sparklineData: token.marketCap.sparklineData,
        };
      });
      state.dynamicData = initialData;
    },
    // Action to update a single token's data (from WebSocket)
    updateTokenData: (state, action: PayloadAction<PriceUpdatePayload>) => {
      const { id, data } = action.payload;
      state.dynamicData[id] = data;
    },
  },
});

export const { setInitialTokenData, updateTokenData } = tokenSlice.actions;

export default tokenSlice.reducer;

