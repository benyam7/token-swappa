export interface Token {
    id: string;
    symbol: string;
    name: string;
    logo: string;
    color: string;
    price: number;
    priceChange24h?: number;
    volume24h?: number;
    contractAddress?: string;
    chainId?: string;
    chainLogo?: string;
    numericChainId?: number;
}

export interface Chain {
    id: string;
    name: string;
    logo: string;
    color: string;
}

export type TokenOrNull = Token | null;

export interface PriceData {
    [key: string]: {
        usd: number;
        usd_24h_change: number;
        usd_24h_vol: number;
    };
}
