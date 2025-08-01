import { useState } from 'react';

import type React from 'react';
import { EnhancedTokenSelector } from './enhanced-token-selector';
import type { Token, TokenOrNull } from '../types/token';
import { Loader2 } from 'lucide-react';
import { formatCurrency, formatTokenAmount } from '../lib/formatters';
import { useIsMobile } from '../hooks/use-is-mobile';
import { popularTokens } from '../data/tokens';
import { Button } from '@/components/ui/button';
import { QuickTokenSelector } from './quick-token-selector'; // Import QuickTokenSelector

interface TokenInputProps {
    label: string;
    token: TokenOrNull;
    amount: string;
    usdValue: string;
    isUSDMode: boolean;
    onAmountChange: (value: string) => void;
    onTokenSelect: (token: Token) => void;
    onUSDToggle: () => void;
    placeholder?: string;
    readOnly?: boolean;
    showQuickSelect?: boolean;
    onHover?: (isHovering: boolean) => void;
    tokens: Token[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    isPulsing: boolean;
    inputId: string;
    autoFocus?: boolean;
}

export function TokenInput({
    label,
    token,
    amount,
    usdValue,
    isUSDMode,
    onAmountChange,
    onTokenSelect,
    onUSDToggle,
    placeholder = '0',
    readOnly = false,
    showQuickSelect = false,
    onHover,
    tokens,
    loading,
    error,
    onRetry,
    isPulsing,
    inputId,
    autoFocus = false,
}: TokenInputProps) {
    const isMobile = useIsMobile();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Special handling for initial "0"
        if (amount === '0' && value.length === 1) {
            if (value === '.') {
                value = '0.'; // If "0" and user types ".", make it "0."
            } else if (value !== '0') {
                value = value; // If "0" and user types "5", make it "5"
            }
            // If user types "0" when it's already "0", keep it "0"
        }

        // General validation
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            onAmountChange(value);
        }
    };

    const displayedValue = isUSDMode ? usdValue : amount;
    let fontSizeClass = isMobile ? 'text-2xl sm:text-4xl' : 'text-4xl';
    if (displayedValue.length > 8) {
        fontSizeClass = isMobile ? 'text-xl sm:text-3xl' : 'text-3xl';
    }
    if (displayedValue.length > 12) {
        fontSizeClass = isMobile ? 'text-lg sm:text-2xl' : 'text-2xl';
    }
    if (displayedValue.length > 16) {
        fontSizeClass = isMobile ? 'text-base sm:text-xl' : 'text-xl';
    }

    return (
        <div className="mb-4">
            <label
                htmlFor={inputId}
                className="text-gray-600 dark:text-gray-300 text-sm mb-2  flex"
            >
                {label}
            </label>
            <div
                className={`bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 relative ${
                    !isMobile && showQuickSelect
                        ? 'transition-all duration-300'
                        : ''
                }`}
                onMouseEnter={() =>
                    !isMobile && showQuickSelect && onHover?.(true)
                }
                onMouseLeave={() =>
                    !isMobile && showQuickSelect && onHover?.(false)
                }
            >
                {/* Quick Token Selector - Rendered here, positioned absolutely */}
                {/* {!isMobile &&
                    showQuickSelect &&
                    !token && ( // Only show on desktop for 'for' section, if no token selected
                        <QuickTokenSelector
                            onTokenSelect={onTokenSelect}
                            isVisible={showQuickSelect && !token}
                            onMouseEnter={
                                onHover ? () => onHover(true) : undefined
                            }
                            onMouseLeave={
                                onHover ? () => onHover(false) : undefined
                            }
                        />
                    )} */}

                {/* Main content area */}
                <div className="flex items-center justify-between mb-2 min-w-0">
                    {/* Input field or loading spinner */}
                    {loading ? (
                        <div
                            className="flex items-center text-4xl font-bold text-gray-900 flex-grow mr-4 min-w-0"
                            aria-live="polite"
                            aria-label="Loading amount"
                        >
                            <Loader2
                                className="w-8 h-8 animate-spin text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                    ) : isUSDMode ? (
                        <div className="flex items-center flex-grow mr-2 min-w-0 overflow-hidden">
                            <span
                                className={`font-bold text-gray-900 dark:text-gray-100 mr-2 ${fontSizeClass} transition-all duration-200`}
                                aria-hidden="true"
                            >
                                $
                            </span>
                            <input
                                id={inputId}
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder={placeholder}
                                readOnly={readOnly}
                                className={`font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none flex-1 min-w-0 w-0 ${
                                    isPulsing ? 'animate-pulseSubtle' : ''
                                } ${fontSizeClass} transition-all duration-200`}
                                aria-label={`${label} amount in USD`}
                                autoFocus={autoFocus}
                            />
                        </div>
                    ) : (
                        <input
                            id={inputId}
                            type="number"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder={placeholder}
                            readOnly={readOnly}
                            className={`font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none flex-grow mr-2 min-w-0 w-0 ${
                                isPulsing ? 'animate-pulseSubtle' : ''
                            } ${fontSizeClass} transition-all duration-200`}
                            aria-label={`${label} amount in ${
                                token?.symbol || 'tokens'
                            }`}
                            autoFocus={autoFocus}
                        />
                    )}
                    {/* Token Selector or  */}

                    {/* EnhancedTokenSelector's default button */}
                    <EnhancedTokenSelector
                        selectedToken={token}
                        onTokenSelect={onTokenSelect}
                        placeholder={token ? undefined : 'Select token'}
                        tokens={tokens}
                        loading={loading}
                        error={error}
                        onRetry={onRetry}
                        idPrefix={inputId}
                        isOpen={isSelectorOpen}
                        setIsOpen={setIsSelectorOpen}
                        className="flex-shrink-0"
                    />
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm flex ">
                    {isUSDMode ? (
                        <button
                            onClick={onUSDToggle}
                            className="hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-pressed={isUSDMode}
                            aria-label={`Toggle ${label} amount to token value`}
                        >
                            ~{' '}
                            {formatTokenAmount(
                                amount && token
                                    ? Number(amount) / token.price
                                    : 0
                            )}{' '}
                            {token?.symbol || ''}
                        </button>
                    ) : (
                        <button
                            onClick={onUSDToggle}
                            className="hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-pressed={isUSDMode}
                            aria-label={`Toggle ${label} amount to USD value`}
                        >
                            ~ {formatCurrency(usdValue)}
                        </button>
                    )}
                </div>
                {error && (
                    <div
                        className="text-red-500 dark:text-red-300 text-xs mt-1"
                        role="alert"
                        aria-live="assertive"
                    >
                        Failed to fetch price.{' '}
                        <button
                            onClick={onRetry}
                            className="underline focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:text-red-300 dark:hover:text-red-100"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
