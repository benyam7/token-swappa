import { useState, useEffect, useCallback, useRef } from 'react'; // Import useRef
import type { Token, PriceData } from '@/types/token';
import { defaultTokens, topTokens } from '@/data/tokens';

const POLLING_INTERVAL = 300000; // 5 minutes (ideally we should fetch every 5 seconds or 3 seconds, but here coingecko )

export function useCoinGeckoPrice() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false); // New state for subtle updates
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for interval ID

    const fetchPrices = useCallback(
        async (isInitialLoad = false) => {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setIsUpdating(true); // Set updating for periodic polls
            }
            setError(null);

            try {
                const tokenIds = topTokens.map((token) => token.id).join(',');
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&x_cg_demo_api_key=${
                        import.meta.env.VITE_COINGECKO_API_KEY
                    }`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: PriceData = await response.json();

                const tokensWithPrices: Token[] = defaultTokens.map(
                    (token) => ({
                        ...token,
                        price: data[token.id]?.usd || 0,
                        priceChange24h: data[token.id]?.usd_24h_change || 0,
                        volume24h: data[token.id]?.usd_24h_vol || 0,
                    })
                );

                setTokens(tokensWithPrices);
                setRetryCount(0); // Reset retry count on success
            } catch (err) {
                console.error('Failed to fetch prices:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch prices'
                );

                // Fallback to default prices if API fails on first attempt
                if (retryCount === 0) {
                    const fallbackTokens: Token[] = defaultTokens.map(
                        (token) => ({
                            ...token,
                            price:
                                token.symbol === 'ETH'
                                    ? 4307.23
                                    : token.symbol.includes('USD')
                                    ? 1.0
                                    : 100, // Example fallback prices
                            priceChange24h: Math.random() * 10 - 5, // Random change for fallback
                            volume24h: Math.random() * 1000000000, // Random volume for fallback
                        })
                    );
                    setTokens(fallbackTokens);
                }
            } finally {
                if (isInitialLoad) {
                    setLoading(false);
                }
                setIsUpdating(false); // Reset updating after poll
            }
        },
        [retryCount]
    );

    const retry = useCallback(() => {
        setRetryCount((prev) => prev + 1);
        fetchPrices(true); // Explicit retry is like an initial load
    }, [fetchPrices]);

    useEffect(() => {
        // Initial fetch
        fetchPrices(true);

        // Set up polling
        intervalRef.current = setInterval(() => {
            fetchPrices(false); // Not an initial load
        }, POLLING_INTERVAL);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchPrices]);

    return { tokens, loading, error, retry, isUpdating }; // Return isUpdating
}
