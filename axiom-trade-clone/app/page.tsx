"use client"; // Required for Next.js App Router

import React, { useState, useEffect, useMemo, memo, useContext, createContext } from 'react';
import { Twitter, Send, Globe, Copy, Filter, Clock, TrendingUp, ChevronDown, Check, DollarSign, Users, Package, Search, Bell, Settings, Moon, Sun, ArrowRight, X } from 'lucide-react';

// --- TYPES ---
// All type definitions are now at the top for clarity

type Token = {
  id: string;
  name: string;
  ticker: string;
  iconUrl: string;
  age: string;
  socials: { twitter: string; telegram: string; website: string };
  marketCap: { value: number; changePercent: number; sparklineData: number[] };
  liquidity: number;
  volume: number;
  transactions: { total: number; buys: number; sells: number };
  tokenInfo: { metricA: number; metricB: number; holderCount: number; teamAllocation: number; status: string };
};

// Define a type for the dynamic data stored in context
type DynamicData = {
  [key: string]: {
    marketCap: number;
    liquidity: number;
    volume: number;
    sparklineData: number[];
  };
};

// Props for the provider
type TokenPriceProviderProps = {
  children: React.ReactNode;
  tokens: Token[] | null;
};

// Props for the filter hooks
type Filters = {
  activeTab: string;
  timeFilter: string;
};

// --- MOCK DATA ---
// This data simulates the structure needed to render the table.
const MOCK_TOKENS_DATA: Token[] = [
  {
    id: 'pumpbook',
    name: 'Pumpbook',
    ticker: 'Pumpfun...',
    iconUrl: 'https://placehold.co/32x32/7c3aed/ffffff?text=P',
    age: '3m',
    socials: { twitter: '#', telegram: '#', website: '#' },
    marketCap: { value: 13500, changePercent: 1.361, sparklineData: [10, 20, 15, 30, 25, 40, 50, 60, 80, 136] },
    liquidity: 16600,
    volume: 32600,
    transactions: { total: 476, buys: 299, sells: 177 },
    tokenInfo: { metricA: 0.1505, metricB: 0, holderCount: 157, teamAllocation: 0, status: 'Unpaid' }
  },
  {
    id: 'tiberius',
    name: 'Tiberius',
    ticker: 'Tiberius...',
    iconUrl: 'https://placehold.co/32x32/c2410c/ffffff?text=T',
    age: '38m',
    socials: { twitter: '#', telegram: '#', website: '#' },
    marketCap: { value: 23200, changePercent: -0.428, sparklineData: [100, 90, 85, 80, 75, 60, 55, 60, 50, 42] },
    liquidity: 16300,
    volume: 20300,
    transactions: { total: 347, buys: 176, sells: 171 },
    tokenInfo: { metricA: 0.2431, metricB: 0.0201, holderCount: 359, teamAllocation: 0, status: 'Paid' }
  },
  {
    id: 'crime',
    name: 'CRIME',
    ticker: '1 crime can c...',
    iconUrl: 'https://placehold.co/32x32/16a34a/ffffff?text=C',
    age: '18m',
    socials: { twitter: '#', telegram: '#', website: '#' },
    marketCap: { value: 15500, changePercent: 0.321, sparklineData: [20, 30, 25, 40, 35, 50, 45, 60, 70, 80] },
    liquidity: 17800,
    volume: 41100,
    transactions: { total: 75, buys: 47, sells: 28 },
    tokenInfo: { metricA: 0.2395, metricB: 0.0401, holderCount: 99, teamAllocation: 0.0088, status: 'Unpaid' }
  },
  {
    id: 'squidward',
    name: 'squidward',
    ticker: 'squidwa...',
    iconUrl: 'https://placehold.co/32x32/0ea5e9/ffffff?text=S',
    age: '30m',
    socials: { twitter: '#', telegram: '#', website: '#' },
    marketCap: { value: 17400, changePercent: -0.187, sparklineData: [60, 55, 50, 45, 40, 35, 30, 25, 20, 18] },
    liquidity: 18700,
    volume: 73900,
    transactions: { total: 118, buys: 57, sells: 61 },
    tokenInfo: { metricA: 0.2239, metricB: 0.0425, holderCount: 135, teamAllocation: 0, status: 'Unpaid' }
  },
  {
    id: 'mrbeast2',
    name: 'MrBeast2.0',
    ticker: '2rady...',
    iconUrl: 'https://placehold.co/32x32/db2777/ffffff?text=M',
    age: '25m',
    socials: { twitter: '#', telegram: '#', website: '#' },
    marketCap: { value: 13900, changePercent: 3.324, sparklineData: [5, 10, 8, 15, 20, 30, 50, 80, 120, 332] },
    liquidity: 17000,
    volume: 33200,
    transactions: { total: 34, buys: 22, sells: 12 },
    tokenInfo: { metricA: 0.2479, metricB: 0.0169, holderCount: 61, teamAllocation: 0.0511, status: 'Unpaid' }
  },
  {
    id: 'cat',
    name: 'Cat',
    ticker: 'cat...',
    iconUrl: 'https://placehold.co/32x32/f97316/ffffff?text=C',
    age: '1h',
    socials: { twitter: '#', telegram: '#', website: '#' },
    marketCap: { value: 25000, changePercent: 0.55, sparklineData: [40, 42, 45, 43, 48, 50, 52, 53, 50, 55] },
    liquidity: 20000,
    volume: 50000,
    transactions: { total: 230, buys: 120, sells: 110 },
    tokenInfo: { metricA: 0.10, metricB: 0.01, holderCount: 200, teamAllocation: 0, status: 'Paid' }
  },
];

// --- CONTEXT (Redux/RTK Simulation) ---
// This context will broadcast real-time price changes to all components.

const TokenPriceContext = createContext<DynamicData>({});

function TokenPriceProvider({ children, tokens }: TokenPriceProviderProps) {
  const [dynamicData, setDynamicData] = useState<DynamicData>({});

  // Initialize dynamic data state from tokens
  useEffect(() => {
    if (tokens) {
      const initialData: DynamicData = {};
      tokens.forEach(token => {
        initialData[token.id] = {
          marketCap: token.marketCap.value,
          liquidity: token.liquidity,
          volume: token.volume,
          sparklineData: token.marketCap.sparklineData
        };
      });
      setDynamicData(initialData);
    }
  }, [tokens]);

  // This useEffect simulates a WebSocket connection
  useEffect(() => {
    if (!tokens || tokens.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random token to update
      const randomTokenId = tokens[Math.floor(Math.random() * tokens.length)].id;
      
      setDynamicData(prevData => {
        const currentTokenData = prevData[randomTokenId];
        if (!currentTokenData) return prevData;

        // Simulate a price change (+/- 3%)
        const change = (Math.random() - 0.5) * 0.06;
        const newMarketCap = Math.max(currentTokenData.marketCap * (1 + change), 1000);
        
        // Update sparkline
        const newSparklineData = [...currentTokenData.sparklineData.slice(1), newMarketCap];

        return {
          ...prevData,
          [randomTokenId]: {
            ...currentTokenData,
            marketCap: newMarketCap,
            liquidity: Math.max(currentTokenData.liquidity * (1 + (Math.random() - 0.5) * 0.02), 1000),
            volume: currentTokenData.volume + Math.floor(Math.random() * 1000),
            sparklineData: newSparklineData,
          },
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [tokens]);

  return (
    <TokenPriceContext.Provider value={dynamicData}>
      {children}
    </TokenPriceContext.Provider>
  );
}

// Custom hook to access the real-time prices
const useTokenPrices = () => useContext(TokenPriceContext);

// --- HOOKS (React Query Simulation) ---
// This hook simulates fetching the initial token list.

function useGetTokens(filters: Filters) {
  const [state, setState] = useState<{ data: Token[] | null; isLoading: boolean; error: Error | null }>({
    data: null,
    isLoading: true,
    error: null,
  });

  // Re-fetch when filters change
  useEffect(() => {
    setState({ data: null, isLoading: true, error: null });
    
    // Simulate network delay
    const timer = setTimeout(() => {
      // In a real app, you'd filter MOCK_TOKENS_DATA based on `filters`
      setState({ data: MOCK_TOKENS_DATA, isLoading: false, error: null });
    }, 1500); // 1.5 second loading time

    return () => clearTimeout(timer);
  }, [filters.activeTab, filters.timeFilter]); // Dependency array

  return state;
}

// --- ATOM COMPONENTS ---
// Small, reusable components

/**
 * A custom Tooltip component built with only Tailwind CSS.
 */
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
        {content}
      </div>
    </div>
  );
}

/**
 * A simple SVG sparkline chart component.
 */
function SparklineChart({ data, color = "#10b981" }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return <div className="h-[30px] w-[100px]" />; // Placeholder

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 2) + 1; // 1px padding
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  const path = `M ${points}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100px" height="30px" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/**
 * A reusable social icon link with a tooltip.
 */
function SocialIconLink({ href, icon, tooltip }: { href: string; icon: 'telegram' | 'twitter' | 'website' | 'copy'; tooltip: string }) {
  const icons = {
    telegram: <Send size={14} className="text-gray-400 group-hover:text-white" />,
    twitter: <Twitter size={14} className="text-gray-400 group-hover:text-white" />,
    website: <Globe size={14} className="text-gray-400 group-hover:text-white" />,
    copy: <Copy size={14} className="text-gray-400 group-hover:text-white" />,
  };
  return (
    <Tooltip content={tooltip}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="group p-1.5 bg-gray-800/50 hover:bg-gray-700 rounded-md transition-colors">
        {icons[icon]}
      </a>
    </Tooltip>
  );
}

/**
 * A component for sortable table headers.
 */
function SortableTableHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${className}`}>
      <div className="flex items-center gap-1 cursor-pointer group">
        {children}
        <ChevronDown size={14} className="opacity-0 group-hover:opacity-100" />
      </div>
    </th>
  );
}

/**
 * A component to render formatted, flashing prices.
 */
function FlashingPrice({ value, formatter, isPercent = false }: { value: number; formatter: Intl.NumberFormat; isPercent?: boolean }) {
  const [prevValue, setPrevValue] = useState(value);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    if (value !== prevValue) {
      setFlash(value > prevValue ? 'text-green-500' : 'text-red-500');
      const timer = setTimeout(() => setFlash(''), 300); // Flash duration
      setPrevValue(value);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  const formattedValue = formatter.format(isPercent ? value : value);
  const sign = isPercent ? (value > 0 ? '+' : '') : '';
  const colorClass = isPercent ? (value > 0 ? 'text-green-500' : 'text-red-500') : 'text-gray-200';
  const transitionClass = 'transition-all duration-300';

  // Apply flash or default color
  const displayClass = flash ? `${flash} ${transitionClass}` : `${colorClass} ${transitionClass}`;
  
  // Note: Formatting for percent is now handled by Intl.NumberFormat
  return (
    <span className={displayClass}>
      {isPercent ? `${sign}${formattedValue}` : formattedValue}
    </span>
  );
}

// --- MOLECULE COMPONENTS ---
// Combinations of atoms

function PairInfoCell({ token }: { token: Token }) {
  return (
    <div className="flex items-center gap-3">
      <img src={token.iconUrl} alt={token.name} className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-200">{token.name}</span>
          <span className="text-xs text-gray-500">{token.ticker}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{token.age}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <SocialIconLink href={token.socials.telegram} icon="telegram" tooltip="Telegram" />
        <SocialIconLink href={token.socials.twitter} icon="twitter" tooltip="Twitter" />
        <SocialIconLink href={token.socials.website} icon="website" tooltip="Website" />
        <SocialIconLink href="#" icon="copy" tooltip="Copy Address" />
      </div>
    </div>
  );
}

function MarketCapCell({ token }: { token: Token }) {
  const dynamicData = useTokenPrices();
  const currentData = dynamicData[token.id];

  const value = currentData?.marketCap ?? token.marketCap.value;
  const changePercent = token.marketCap.changePercent; // Static % for this demo
  const sparklineData = currentData?.sparklineData ?? token.marketCap.sparklineData;
  const sparklineColor = value > (sparklineData[0] || 0) ? '#10b981' : '#ef4444';
  
  const mcapFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="font-medium text-sm">
          <FlashingPrice value={value} formatter={mcapFormatter} />
        </div>
        <div className="text-xs">
          <FlashingPrice value={changePercent} formatter={percentFormatter} isPercent={true} />
        </div>
      </div>
      <SparklineChart data={sparklineData} color={sparklineColor} />
    </div>
  );
}

function TokenInfoCell({ info }: { info: Token['tokenInfo'] }) {
  const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  return (
    <div className="flex justify-between items-center text-xs">
      <div className="flex flex-col gap-1 text-gray-400">
        <span><TrendingUp size={12} className="inline mr-1.5" /> {percentFormatter.format(info.metricA)}</span>
        <span><DollarSign size={12} className="inline mr-1.5" /> {percentFormatter.format(info.metricB)}</span>
        <span><Package size={12} className="inline mr-1.5" /> {percentFormatter.format(info.teamAllocation)}</span>
      </div>
      <div className="flex flex-col gap-1 text-gray-400 items-end">
        <span><Users size={12} className="inline mr-1.5" /> {info.holderCount}</span>
        <span><Check size={12} className="inline mr-1.5" /> {info.status}</span>
        {/* Placeholder for the last item */}
        <span className="text-gray-600">...</span>
      </div>
    </div>
  );
}

function TableFilters({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) {
  const TABS = ['Trending', 'Surge', 'DEX Screener', 'Pump Live'];
  const TIMES = ['1m', '5m', '30m', '1h'];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
      <div className="flex items-center gap-2 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilters(f => ({ ...f, activeTab: tab.toLowerCase().replace(' ', '-') }))}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              filters.activeTab === tab.toLowerCase().replace(' ', '-')
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {TIMES.map(time => (
          <button
            key={time}
            onClick={() => setFilters(f => ({ ...f, timeFilter: time }))}
            className={`px-3 py-1.5 rounded-md text-xs font-medium ${
              filters.timeFilter === time ? 'bg-gray-700 text-white' : 'text-gray-400 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {time}
          </button>
        ))}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-gray-400 bg-gray-800 hover:bg-gray-700">
          <Filter size={14} />
          Filter
        </button>
      </div>
    </div>
  );
}

// --- ORGANISM COMPONENTS ---
// Large layout sections

const TokenTableRow = memo(({ token }: { token: Token }) => {
  const dynamicData = useTokenPrices();
  const currentData = dynamicData[token.id];
  
  const valueFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0 });

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
      <td className="px-4 py-3 align-top min-w-[300px]">
        <PairInfoCell token={token} />
      </td>
      <td className="px-4 py-3 align-top min-w-[220px]">
        <MarketCapCell token={token} />
      </td>
      <td className="px-4 py-3 align-top">
        <div className="font-medium text-sm text-gray-200">
          <FlashingPrice value={currentData?.liquidity ?? token.liquidity} formatter={valueFormatter} />
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="font-medium text-sm text-gray-200">
          <FlashingPrice value={currentData?.volume ?? token.volume} formatter={valueFormatter} />
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="font-medium text-sm text-gray-200">{token.transactions.total}</div>
        <div className="text-xs text-gray-400">
          <span className="text-green-500">{token.transactions.buys}</span>
          <span> / </span>
          <span className="text-red-500">{token.transactions.sells}</span>
        </div>
      </td>
      <td className="px-4 py-3 align-top min-w-[200px]">
        <TokenInfoCell info={token.tokenInfo} />
      </td>
      <td className="px-4 py-3 align-top text-center">
        <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
          Buy
        </button>
      </td>
    </tr>
  );
});
TokenTableRow.displayName = 'TokenTableRow'; // For React DevTools

function TokenTable({ tokens, isLoading }: { tokens: Token[] | null; isLoading: boolean }) {
  if (isLoading || !tokens) { // Show skeleton if loading or if tokens are null
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <SortableTableHeader>Pair Info</SortableTableHeader>
              <SortableTableHeader>Market Cap</SortableTableHeader>
              <SortableTableHeader>Liquidity</SortableTableHeader>
              <SortableTableHeader>Volume</SortableTableHeader>
              <SortableTableHeader>TXNS</SortableTableHeader>
              <SortableTableHeader>Token Info</SortableTableHeader>
              <SortableTableHeader>Action</SortableTableHeader>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-900/50">
          <tr className="border-b border-gray-800">
            <SortableTableHeader>Pair Info</SortableTableHeader>
            <SortableTableHeader>Market Cap</SortableTableHeader>
            <SortableTableHeader>Liquidity</SortableTableHeader>
            <SortableTableHeader>Volume</SortableTableHeader>
            <SortableTableHeader>TXNS</SortableTableHeader>
            <SortableTableHeader>Token Info</SortableTableHeader>
            <SortableTableHeader>Action</SortableTableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {tokens.map(token => (
            <TokenTableRow key={token.id} token={token} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * A single skeleton row for the loading state.
 */
function SkeletonRow() {
  const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`bg-gray-800 animate-pulse rounded ${className}`} />
  );

  return (
    <tr className="border-b border-gray-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-[30px] w-[100px]" />
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
      <td className="px-4 py-3"><Skeleton className="h-12 w-full" /></td>
      <td className="px-4 py-3"><Skeleton className="h-8 w-16 rounded-lg inline-block" /></td>
    </tr>
  );
}

/**
 * Main application component.
 */
export default function App() {
  const [filters, setFilters] = useState<Filters>({
    activeTab: 'surge',
    timeFilter: '5m',
  });

  const { data: tokens, isLoading } = useGetTokens(filters);

  return (
    <TokenPriceProvider tokens={tokens}>
      <div className="min-h-screen bg-gray-950 text-gray-300 font-sans p-4 sm:p-6">
        {/* Header - A simplified replica */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-800">
          
          {/* Left Side: Logo + Nav */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <h1 className="text-xl font-bold text-white flex-shrink-0">
              AXIOM <span className="text-blue-500">Pro</span>
            </h1>
            {/* Nav scrolls horizontally on small screens */}
            <nav className="flex items-center gap-3 pb-2 sm:pb-0 overflow-x-auto">
              <a href="#" className="text-sm text-gray-400 hover:text-white whitespace-nowrap">Discover</a>
              <a href="#" className="text-sm text-white font-medium whitespace-nowrap">Pulse</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white whitespace-nowrap">Trackers</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white whitespace-nowrap">Perpetuals</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white whitespace-nowrap">Yield</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white whitespace-nowrap">Portfolio</a>
            </nav>
          </div>
          
          {/* Right Side: Search + Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search input is full-width on mobile (w-full) and fixed on larger screens (sm:w-48) */}
            <div className="relative w-full sm:w-auto">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search by token or CA..."
                className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-1.5 text-sm w-full sm:w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Button group stretches on mobile (w-full) */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-stretch sm:justify-start">
              <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                Deposit
              </button>
              <button className="flex-none p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
                <Bell size={18} />
              </button>
              <button className="flex-none p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
                <Sun size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content - The Dashboard */}
        <main className="mt-4">
          <TableFilters filters={filters} setFilters={setFilters} />
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl">
            <TokenTable tokens={tokens} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </TokenPriceProvider>
  );
}