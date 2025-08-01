import { useState, useEffect, useCallback, useRef } from 'react';
import { getAssetPriceInfo } from '@funkit/api-base';
import type { Token } from '@/types/token';
import { defaultTokens } from '@/data/tokens';

const POLLING_INTERVAL = 300000; // 5 minutes
const FUNKIT_API_KEY = import.meta.env.VITE_FUNKIT_API_KEY;

// FunKit API response interface (actual format)
interface FunKitPriceResponse {
    unitPrice: number;
    amount: number;
    total: number;
}

export function useFunKitPrice() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchPrices = useCallback(
        async (isInitialLoad = false) => {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setIsUpdating(true);
            }
            setError(null);
            console.log(
                'fetching prices from funkit these tokens',
                defaultTokens
            );
            try {
                const tokensWithPrices: Token[] = [];

                // Fetch prices for each token
                for (const token of defaultTokens) {
                    try {
                        const chainId = token.numericChainId;

                        if (!chainId) {
                            console.warn(
                                `Unknown chain ID for token ${token.symbol}`
                            );
                            continue;
                        }

                        // For ETH, we can get price directly using a native token approach
                        if (token.symbol === 'ETH') {
                            const priceData = await getAssetPriceInfo({
                                chainId,
                                assetTokenAddress:
                                    '0x0000000000000000000000000000000000000000', // ETH native address
                                apiKey: FUNKIT_API_KEY,
                            });

                            tokensWithPrices.push({
                                ...token,
                                price:
                                    typeof priceData === 'number'
                                        ? priceData
                                        : (priceData as FunKitPriceResponse)
                                              ?.unitPrice || 0,
                                priceChange24h: 0, // FunKit may not provide this data
                                volume24h: 0, // FunKit may not provide this data
                            });
                        } else {
                            // For ERC20 tokens, use contract address
                            const priceData = await getAssetPriceInfo({
                                chainId: chainId.toString(),
                                assetTokenAddress: token.contractAddress || '',
                                apiKey: FUNKIT_API_KEY,
                            });
                            console.log(priceData, 'priceData');

                            tokensWithPrices.push({
                                ...token,
                                price:
                                    typeof priceData === 'number'
                                        ? priceData
                                        : (priceData as FunKitPriceResponse)
                                              ?.unitPrice || 0,
                                priceChange24h: 0, // FunKit dont provide this data
                                volume24h: 0, // FunKit dont provide this data
                            });
                        }
                    } catch (tokenError) {
                        console.warn(
                            `Failed to fetch price for ${token.symbol}:`,
                            tokenError
                        );
                        // Add token with zero price if individual fetch fails
                        tokensWithPrices.push({
                            ...token,
                            price: 0,
                            priceChange24h: 0,
                            volume24h: 0,
                        });
                    }
                }

                setTokens(tokensWithPrices);
                setRetryCount(0);
            } catch (err) {
                console.error('Failed to fetch prices from FunKit:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch prices from FunKit'
                );

                // Fallback to default prices if API fails on first attempt
                if (retryCount === 0) {
                    const fallbackTokens: Token[] = defaultTokens.map(
                        (token) => ({
                            ...token,
                            price: 0, // Will trigger fallback to CoinGecko
                            priceChange24h: 0,
                            volume24h: 0,
                        })
                    );
                    setTokens(fallbackTokens);
                }
            } finally {
                if (isInitialLoad) {
                    setLoading(false);
                }
                setIsUpdating(false);
            }
        },
        [retryCount]
    );

    const retry = useCallback(() => {
        setRetryCount((prev) => prev + 1);
        fetchPrices(true);
    }, [fetchPrices]);

    useEffect(() => {
        // Initial fetch
        fetchPrices(true);

        // Set up polling
        intervalRef.current = setInterval(() => {
            fetchPrices(false);
        }, POLLING_INTERVAL);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchPrices]);

    return { tokens, loading, error, retry, isUpdating };
}
