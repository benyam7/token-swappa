import { useState, useEffect, useCallback } from 'react';
import type { Token } from '@/types/token';
import { useFunKitPrice } from './use-fun-kit-price';
import { useCoinGeckoPrice } from './use-coin-gecko-price';

export function useTokenPrices() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [priceSource, setPriceSource] = useState<
        'funkit' | 'coingecko' | null
    >(null);

    // Get data from both hooks
    const {
        tokens: funKitTokens,
        loading: funKitLoading,
        error: funKitError,
        retry: retryFunKit,
        isUpdating: funKitUpdating,
    } = useFunKitPrice();
    console.log('funkit tokens', funKitTokens);
    const {
        tokens: coinGeckoTokens,
        loading: coinGeckoLoading,
        error: coinGeckoError,
        retry: retryCoinGecko,
        isUpdating: coinGeckoUpdating,
    } = useCoinGeckoPrice();

    // Check if FunKit data is valid (has prices > 0)
    const isFunKitDataValid = useCallback((tokens: Token[]) => {
        return tokens.length > 0 && tokens.some((token) => token.price > 0);
    }, []);

    // Combine and prioritize data sources
    useEffect(() => {
        // If FunKit is loading, keep loading state
        if (funKitLoading) {
            setLoading(true);
            setIsUpdating(false);
            return;
        }

        // If FunKit has valid data, use it
        if (funKitTokens.length > 0 && isFunKitDataValid(funKitTokens)) {
            setTokens(funKitTokens);
            setLoading(false);
            setIsUpdating(funKitUpdating);
            setError(null);
            setPriceSource('funkit');
            return;
        }

        // If FunKit failed or has no valid data, fallback to CoinGecko
        if (!coinGeckoLoading && coinGeckoTokens.length > 0) {
            setTokens(coinGeckoTokens);
            setLoading(false);
            setIsUpdating(coinGeckoUpdating);
            setPriceSource('coingecko');

            // Set error only if both services failed
            if (funKitError && coinGeckoError) {
                setError(
                    `FunKit: ${funKitError}, CoinGecko: ${coinGeckoError}`
                );
            } else if (funKitError && !coinGeckoError) {
                setError(null); // CoinGecko worked, so clear error
            } else {
                setError(coinGeckoError);
            }
            return;
        }

        // If CoinGecko is still loading, show loading state
        if (coinGeckoLoading) {
            setLoading(true);
            setIsUpdating(false);
            return;
        }

        // Both services failed
        setLoading(false);
        setIsUpdating(false);
        setError(
            `Both price services failed. FunKit: ${
                funKitError || 'Unknown error'
            }, CoinGecko: ${coinGeckoError || 'Unknown error'}`
        );
        setPriceSource(null);
    }, [
        funKitTokens,
        funKitLoading,
        funKitError,
        funKitUpdating,
        coinGeckoTokens,
        coinGeckoLoading,
        coinGeckoError,
        coinGeckoUpdating,
        isFunKitDataValid,
    ]);

    // Retry function that tries FunKit first, then CoinGecko
    const retry = useCallback(() => {
        setPriceSource(null);
        setError(null);
        retryFunKit();

        // If FunKit fails, retry CoinGecko after a short delay
        setTimeout(() => {
            if (!isFunKitDataValid(funKitTokens)) {
                retryCoinGecko();
            }
        }, 2000);
    }, [retryFunKit, retryCoinGecko, funKitTokens, isFunKitDataValid]);

    return {
        tokens,
        loading,
        error,
        retry,
        isUpdating,
        priceSource, // Expose which service is currently being used
    };
}
