'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTokenData } from '@/store/tokenSlice';
import { RootState } from '@/store/store';

/**
 * This hook simulates a WebSocket connection.
 * It dispatches updates to the Redux store.
 */
export function useTokenUpdates() {
  const dispatch = useDispatch();
  const dynamicData = useSelector((state: RootState) => state.tokens.dynamicData);
  const tokenIds = Object.keys(dynamicData);

  useEffect(() => {
    if (tokenIds.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random token to update
      const randomTokenId = tokenIds[Math.floor(Math.random() * tokenIds.length)];
      const currentTokenData = dynamicData[randomTokenId];

      if (!currentTokenData) return;

      // Simulate a price change (+/- 3%)
      const change = (Math.random() - 0.5) * 0.06;
      const newMarketCap = Math.max(currentTokenData.marketCap * (1 + change), 1000);
      
      // Update sparkline
      const newSparklineData = [...currentTokenData.sparklineData.slice(1), newMarketCap];

      // Dispatch the update to Redux
      dispatch(
        updateTokenData({
          id: randomTokenId,
          data: {
            marketCap: newMarketCap,
            liquidity: Math.max(currentTokenData.liquidity * (1 + (Math.random() - 0.5) * 0.02), 1000),
            volume: currentTokenData.volume + Math.floor(Math.random() * 1000),
            sparklineData: newSparklineData,
          },
        })
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [tokenIds, dynamicData, dispatch]);
}

