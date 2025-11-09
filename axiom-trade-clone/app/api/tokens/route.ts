import { NextResponse } from 'next/server';
import { TokenData } from '@/types/token';

// This is your mock data, pretending to be a database
const MOCK_TOKENS_DATA: TokenData[] = [
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

export async function GET(request: Request) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you'd get filters from request.url
  
  return NextResponse.json(MOCK_TOKENS_DATA);
}

