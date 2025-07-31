import type { Token } from '../types/token';

export const defaultTokens: Omit<
    Token,
    'price' | 'priceChange24h' | 'volume24h'
>[] = [
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        logo: '⟠',
        color: 'bg-blue-500',
        contractAddress: '0x0000000000000000000000000000000000000000',
        chainId: 'ethereum',
    },
    {
        id: 'usd-coin',
        symbol: 'USDC',
        name: 'USD Coin',
        logo: '$',
        color: 'bg-blue-600',
        contractAddress: '0xA0b86a33E6441e6e80D0c4C96C5C2e5c5e5c5e5c',
        chainId: 'ethereum',
    },
    {
        id: 'tether',
        symbol: 'USDT',
        name: 'Tether',
        logo: '₮',
        color: 'bg-green-500',
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        chainId: 'ethereum',
    },
    {
        id: 'dai',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        logo: '◈',
        color: 'bg-yellow-500',
        contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        chainId: 'ethereum',
    },
    {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'BNB',
        logo: '⬢',
        color: 'bg-yellow-600',
        contractAddress: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        chainId: 'binance-smart-chain',
    },
    {
        id: 'wrapped-bitcoin',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        logo: '₿',
        color: 'bg-orange-500',
        contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        chainId: 'ethereum',
    },

    {
        id: 'chainlink',
        symbol: 'LINK',
        name: 'Chainlink',
        logo: '⬡',
        color: 'bg-blue-700',
        contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        chainId: 'ethereum',
    },
];

export const topTokens = defaultTokens.slice(1, 5); // USDC, USDT, DAI, BNB
export const popularTokens = defaultTokens.slice(0, 4);
export const tokens = defaultTokens;
