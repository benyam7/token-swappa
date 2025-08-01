import { useState, useEffect, useCallback } from 'react';
import { getAssetErc20ByChainAndSymbol } from '@funkit/api-base';

const FUNKIT_API_KEY = import.meta.env.VITE_FUNKIT_API_KEY;

// FunKit token info response interface
interface FunKitTokenInfo {
    symbol?: string;
    name?: string;
    decimals?: number;
    address?: string;
    chainId?: string;
    [key: string]: any; // Allow for additional properties
}

// Map our chain IDs to FunKit chain IDs
const chainIdMap: Record<string, string> = {
    ethereum: '1',
    'binance-smart-chain': '56',
    polygon: '137',
    arbitrum: '42161',
    optimism: '10',
};

interface UseFunKitTokenInfoParams {
    symbol: string;
    chainId?: string;
    enabled?: boolean; // Whether to fetch automatically
}

export function useFunKitTokenInfo({
    symbol,
    chainId = 'ethereum',
    enabled = true,
}: UseFunKitTokenInfoParams) {
    const [tokenInfo, setTokenInfo] = useState<FunKitTokenInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTokenInfo = useCallback(async () => {
        if (!symbol || !enabled) return;

        setLoading(true);
        setError(null);

        try {
            const mappedChainId = chainIdMap[chainId];

            if (!mappedChainId) {
                throw new Error(`Unsupported chain ID: ${chainId}`);
            }

            const tokenData = await getAssetErc20ByChainAndSymbol({
                chainId: mappedChainId,
                symbol: symbol.toUpperCase(),
                apiKey: FUNKIT_API_KEY,
            });

            console.log('FunKit Token Info:', tokenData);
            setTokenInfo(tokenData as FunKitTokenInfo);
        } catch (err) {
            console.error('Failed to fetch token info from FunKit:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch token information'
            );
            setTokenInfo(null);
        } finally {
            setLoading(false);
        }
    }, [symbol, chainId, enabled]);

    // Manual refetch function
    const refetch = useCallback(() => {
        fetchTokenInfo();
    }, [fetchTokenInfo]);

    useEffect(() => {
        if (enabled && symbol) {
            fetchTokenInfo();
        }
    }, [fetchTokenInfo, enabled, symbol]);

    return {
        tokenInfo,
        loading,
        error,
        refetch,
    };
}

// Hook for fetching multiple token infos
export function useFunKitTokenInfoBatch(
    tokens: Array<{ symbol: string; chainId?: string }>,
    enabled = true
) {
    const [tokenInfos, setTokenInfos] = useState<
        Record<string, FunKitTokenInfo>
    >({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTokenInfos = useCallback(async () => {
        if (!tokens.length || !enabled) return;

        setLoading(true);
        setError(null);

        try {
            const results: Record<string, FunKitTokenInfo> = {};

            // Fetch token info for each token
            for (const token of tokens) {
                try {
                    const mappedChainId =
                        chainIdMap[token.chainId || 'ethereum'];

                    if (!mappedChainId) {
                        console.warn(`Unsupported chain ID: ${token.chainId}`);
                        continue;
                    }

                    const tokenData = await getAssetErc20ByChainAndSymbol({
                        chainId: mappedChainId,
                        symbol: token.symbol.toUpperCase(),
                        apiKey: FUNKIT_API_KEY,
                    });

                    results[`${token.symbol}-${token.chainId || 'ethereum'}`] =
                        tokenData as FunKitTokenInfo;
                } catch (tokenError) {
                    console.warn(
                        `Failed to fetch info for ${token.symbol}:`,
                        tokenError
                    );
                }
            }

            setTokenInfos(results);
        } catch (err) {
            console.error('Failed to fetch token infos from FunKit:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch token information'
            );
        } finally {
            setLoading(false);
        }
    }, [tokens, enabled]);

    const refetch = useCallback(() => {
        fetchTokenInfos();
    }, [fetchTokenInfos]);

    useEffect(() => {
        if (enabled && tokens.length > 0) {
            fetchTokenInfos();
        }
    }, [fetchTokenInfos, enabled, tokens]);

    return {
        tokenInfos,
        loading,
        error,
        refetch,
    };
}
