import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sun,
    Moon,
    ArrowUpDown,
    Info,
    Loader2,
    TriangleAlert,
} from 'lucide-react';
import { TokenInput } from '@/components/token-input';
import type { Token, TokenOrNull } from '@/types/token';
import { useTokenPrices } from '@/hooks/use-token-prices';
import { formatCurrency } from '@/lib/formatters';
import { useTheme } from '@/hooks/use-theme';

export function TokenSwappaApp() {
    const { tokens, loading, error, retry, isUpdating, priceSource } =
        useTokenPrices();
    console.log('price source', priceSource);
    const [fromToken, setFromToken] = useState<TokenOrNull>(null);
    const [toToken, setToToken] = useState<TokenOrNull>(null);
    const [fromAmount, setFromAmount] = useState<string>(''); // Changed initial value to ""
    const [toAmount, setToAmount] = useState<string>('');
    const [fromUSDMode, setFromUSDMode] = useState<boolean>(true);
    const [toUSDMode, setToUSDMode] = useState<boolean>(false);
    const [showQuickSelect, setShowQuickSelect] = useState<boolean>(false);
    const [quickSelectTimeout, setQuickSelectTimeout] =
        useState<NodeJS.Timeout | null>(null);
    const [isFromAmountRecalculating, setIsFromAmountRecalculating] =
        useState<boolean>(false);
    const [isToAmountRecalculating, setIsToAmountRecalculating] =
        useState<boolean>(false);

    const { theme, setTheme } = useTheme();

    // Set default fromToken to ETH when data loads
    useEffect(() => {
        if (tokens.length > 0 && !fromToken) {
            const ethToken = tokens.find((t) => t.symbol === 'ETH');
            if (ethToken) setFromToken(ethToken);
        }
    }, [tokens, fromToken]);

    // Calculate exchange rate and amounts for 'to' based on 'from'
    useEffect(() => {
        if (fromAmount && !isNaN(Number(fromAmount)) && fromToken && toToken) {
            setIsToAmountRecalculating(true);
            const timer = setTimeout(() => {
                let fromAmountInTokens = Number(fromAmount);
                if (fromUSDMode) {
                    // Handle division by zero for fromToken.price
                    if (fromToken.price === 0) {
                        setToAmount(''); // Cannot calculate if fromToken price is 0
                        setIsToAmountRecalculating(false);
                        return;
                    }
                    fromAmountInTokens = Number(fromAmount) / fromToken.price;
                }

                // Handle division by zero for toToken.price
                if (toToken.price === 0) {
                    setToAmount(''); // Cannot calculate if toToken price is 0
                    setIsToAmountRecalculating(false);
                    return;
                }

                const rate = fromToken.price / toToken.price;
                const calculatedAmount = fromAmountInTokens * rate;

                // Ensure calculatedAmount is a finite number
                if (isNaN(calculatedAmount) || !isFinite(calculatedAmount)) {
                    setToAmount(''); // Set to empty string if calculation results in NaN/Infinity
                } else {
                    if (toUSDMode) {
                        setToAmount(calculatedAmount.toFixed(2));
                    } else {
                        setToAmount(calculatedAmount.toFixed(6));
                    }
                }
                setIsToAmountRecalculating(false);
            }, 300); // Small delay for animation
            return () => clearTimeout(timer);
        } else {
            setToAmount('');
            setIsToAmountRecalculating(false);
        }
    }, [fromAmount, fromToken, toToken, fromUSDMode, toUSDMode]);

    // Handle bidirectional editing for "to" amount
    const handleToAmountChange = useCallback(
        (value: string) => {
            if (!fromToken || !toToken) return;

            setToAmount(value); // Update immediately for user input

            if (value && !isNaN(Number(value))) {
                setIsFromAmountRecalculating(true);
                const timer = setTimeout(() => {
                    let toAmountInTokens = Number(value);
                    if (toUSDMode) {
                        // Handle division by zero for toToken.price
                        if (toToken.price === 0) {
                            setFromAmount(''); // Cannot calculate if toToken price is 0
                            setIsFromAmountRecalculating(false);
                            return;
                        }
                        toAmountInTokens = Number(value) / toToken.price;
                    }

                    // Handle division by zero for fromToken.price
                    if (fromToken.price === 0) {
                        setFromAmount(''); // Cannot calculate if fromToken price is 0
                        setIsFromAmountRecalculating(false);
                        return;
                    }

                    const fromAmountInTokens =
                        (toAmountInTokens * toToken.price) / fromToken.price;

                    // Ensure fromAmountInTokens is a finite number
                    if (
                        isNaN(fromAmountInTokens) ||
                        !isFinite(fromAmountInTokens)
                    ) {
                        setFromAmount(''); // Set to empty string if calculation results in NaN/Infinity
                    } else {
                        if (fromUSDMode) {
                            setFromAmount(fromAmountInTokens.toFixed(2));
                        } else {
                            setFromAmount(fromAmountInTokens.toFixed(6));
                        }
                    }
                    setIsFromAmountRecalculating(false);
                }, 300); // Small delay for animation
                // No cleanup needed here as it's a direct user action
            } else {
                setFromAmount('');
                setIsFromAmountRecalculating(false);
            }
        },
        [fromToken, toToken, fromUSDMode, toUSDMode]
    );

    const handleSwapTokens = useCallback(() => {
        if (toToken && fromToken) {
            setFromToken(toToken);
            setToToken(fromToken);
            setFromAmount(toAmount);
            // Swap USD modes as well
            const tempUSDMode = fromUSDMode;
            setFromUSDMode(toUSDMode);
            setToUSDMode(tempUSDMode);
        }
    }, [fromToken, toToken, fromAmount, toAmount, fromUSDMode, toUSDMode]);

    const handleFromAmountChange = useCallback((value: string) => {
        setFromAmount(value);
    }, []);

    const getUSDValue = useCallback(
        (amount: string, token: Token | null, isUSDMode: boolean) => {
            if (!amount || !token || isNaN(Number(amount))) return '0.00';

            if (isUSDMode) {
                return Number(amount).toFixed(2);
            } else {
                return (Number(amount) * token.price).toFixed(2);
            }
        },
        []
    );

    const getExchangeRate = useCallback(() => {
        if (!toToken || !fromToken) return '';
        console.log(fromToken.price, toToken.price);
        const rate = fromToken.price / toToken.price;
        return `1 ${fromToken.symbol} = ${rate.toFixed(6)} ${
            toToken.symbol
        } (${formatCurrency(fromToken.price)})`;
    }, [fromToken, toToken]);

    const getPriceChange = useCallback(() => {
        if (
            !fromAmount ||
            !toAmount ||
            !toToken ||
            !fromToken ||
            isNaN(Number(fromAmount)) ||
            isNaN(Number(toAmount))
        ) {
            return '0.00%';
        }

        let fromUSDValue = Number(fromAmount);
        let toUSDValue = Number(toAmount);

        if (!fromUSDMode) {
            fromUSDValue = Number(fromAmount) * fromToken.price;
        }
        if (!toUSDMode) {
            toUSDValue = Number(toAmount) * toToken.price;
        }

        const percentageChange =
            ((toUSDValue - fromUSDValue) / fromUSDValue) * 100;
        const sign = percentageChange >= 0 ? '+' : '';
        return `${sign}${percentageChange.toFixed(3)}%`;
    }, [fromAmount, toAmount, fromToken, toToken, fromUSDMode, toUSDMode]);

    const handleQuickSelectHover = useCallback(
        (isHovering: boolean) => {
            if (quickSelectTimeout) {
                clearTimeout(quickSelectTimeout);
                setQuickSelectTimeout(null);
            }

            if (isHovering) {
                setShowQuickSelect(true);
            } else {
                const timeout = setTimeout(() => {
                    setShowQuickSelect(false);
                }, 200);
                setQuickSelectTimeout(timeout);
            }
        },
        [quickSelectTimeout]
    );

    useEffect(() => {
        return () => {
            if (quickSelectTimeout) {
                clearTimeout(quickSelectTimeout);
            }
        };
    }, [quickSelectTimeout]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Swap
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label={`Switch to ${
                            theme === 'light' ? 'dark' : 'light'
                        } mode`}
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5" aria-hidden="true" />
                        ) : (
                            <Sun className="w-5 h-5" aria-hidden="true" />
                        )}
                    </Button>
                </div>

                {/* Global Error Message */}
                {error && (
                    <div
                        className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 animate-fadeIn dark:bg-red-950 dark:border-red-800 dark:text-red-300"
                        role="alert"
                        aria-live="assertive"
                    >
                        <TriangleAlert
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            aria-hidden="true"
                        />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">Error!</p>
                            <p className="text-sm">
                                Failed to load token prices. {error}
                            </p>
                        </div>
                        <Button
                            onClick={retry}
                            variant="outline"
                            size="sm"
                            className="flex-shrink-0 text-red-700 hover:text-red-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:text-red-200 dark:hover:text-red-50 dark:border-red-700 dark:hover:bg-red-800 bg-transparent"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* From Section */}
                <TokenInput
                    label="From"
                    token={fromToken}
                    amount={fromAmount}
                    usdValue={getUSDValue(fromAmount, fromToken, fromUSDMode)}
                    isUSDMode={fromUSDMode}
                    onAmountChange={handleFromAmountChange}
                    onTokenSelect={setFromToken}
                    onUSDToggle={() => setFromUSDMode(!fromUSDMode)}
                    tokens={tokens}
                    loading={loading}
                    error={error}
                    onRetry={retry}
                    isPulsing={isFromAmountRecalculating || isUpdating}
                    inputId="from-amount-input"
                    autoFocus={true}
                />

                {/* Swap Button */}
                <div className="flex justify-center mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSwapTokens}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                        disabled={!toToken || !fromToken || loading}
                        aria-label="Swap tokens"
                    >
                        <ArrowUpDown
                            className="w-4 h-4 text-gray-600 dark:text-gray-300"
                            aria-hidden="true"
                        />
                    </Button>
                </div>

                {/* To Section with Quick Select */}
                {/* Removed the QuickTokenSelector wrapper div here */}
                <TokenInput
                    label="For"
                    token={toToken}
                    amount={toAmount}
                    usdValue={getUSDValue(toAmount, toToken, toUSDMode)}
                    isUSDMode={toUSDMode}
                    onAmountChange={handleToAmountChange}
                    onTokenSelect={setToToken}
                    onUSDToggle={() => setToUSDMode(!toUSDMode)}
                    showQuickSelect={true}
                    onHover={handleQuickSelectHover}
                    tokens={tokens}
                    loading={loading}
                    error={error}
                    onRetry={retry}
                    isPulsing={isToAmountRecalculating || isUpdating}
                    inputId="to-amount-input"
                />

                {/* Exchange Rate Info */}
                {toToken && fromToken && (
                    <div
                        className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400"
                        role="status"
                    >
                        <Info className="w-4 h-4" aria-hidden="true" />
                        <span>{getExchangeRate()}</span>
                    </div>
                )}

                {/* Price Change Display */}
                {toToken && fromToken && toAmount && (
                    <div
                        className="text-center mb-4 text-sm"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="text-gray-500 dark:text-gray-400">
                            USD Value Change:{' '}
                        </span>
                        <span
                            className={
                                getPriceChange().startsWith('+')
                                    ? 'text-green-600'
                                    : getPriceChange().startsWith('-')
                                    ? 'text-red-600'
                                    : 'text-gray-500 dark:text-gray-400'
                            }
                        >
                            {getPriceChange()}
                        </span>
                    </div>
                )}

                {/* Review Button */}
                <Button
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-4 rounded-2xl text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    disabled={
                        !fromAmount ||
                        fromAmount === '0' ||
                        !toToken ||
                        !fromToken ||
                        loading
                    }
                    aria-live="polite"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2
                                className="w-5 h-5 animate-spin"
                                aria-hidden="true"
                            />{' '}
                            Loading...
                        </span>
                    ) : (
                        'Swap'
                    )}
                </Button>

                {/* Footer */}
                <footer className="flex items-center justify-center gap-2 text-gray-500 text-sm dark:text-gray-400">
                    {priceSource && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Price data from{' '}
                            {priceSource === 'funkit' ? 'FunKit' : 'CoinGecko'}
                        </span>
                    )}
                    {isUpdating && (
                        <span className="flex items-center gap-1 ml-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Updating prices...
                        </span>
                    )}
                </footer>
            </div>
        </main>
    );
}
