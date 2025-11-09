'use client';

import { useQuery } from '@tanstack/react-query';
import { TokenData } from '@/types/token';
import { setInitialTokenData } from '@/store/tokenSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

// Define filter types
interface TokenFilters {
  activeTab: string;
  timeFilter: string;
}

// The actual fetch function
const fetchTokens = async (filters: TokenFilters): Promise<TokenData[]> => {
  // Use URLSearchParams to pass filters to the API
  const params = new URLSearchParams({
    tab: filters.activeTab,
    time: filters.timeFilter,
  });

  const res = await fetch(`/api/tokens?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export function useGetTokens(filters: TokenFilters) {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ['tokens', filters.activeTab, filters.timeFilter],
    queryFn: () => fetchTokens(filters),
  });

  // When data is successfully fetched, initialize the Redux store
  useEffect(() => {
    if (query.data) {
      // FIX: Changed query..data (two dots) to query.data (one dot)
      dispatch(setInitialTokenData(query.data));
    }
  }, [query.data, dispatch]);

  return query;
}

