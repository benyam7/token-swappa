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
    let fontSizeClass = 'text-4xl';
    if (displayedValue.length > 10) {
        fontSizeClass = 'text-3xl';
    }
    if (displayedValue.length > 15) {
        fontSizeClass = 'text-2xl';
    }
    if (displayedValue.length > 20) {
        fontSizeClass = 'text-xl';
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
                <div className="flex items-center justify-between mb-2">
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
                        <div className="flex items-center flex-grow mr-4 min-w-0">
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
                                className={`font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none flex-1 ${
                                    isPulsing ? 'animate-pulseSubtle' : ''
                                } ${fontSizeClass} transition-all duration-200`}
                                aria-label={`${label} amount in USD`}
                                autoFocus={autoFocus}
                            />
                        </div>
                    ) : (
                        <input
                            id={inputId}
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder={placeholder}
                            readOnly={readOnly}
                            className={`font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none flex-grow mr-4 min-w-0 ${
                                isPulsing ? 'animate-pulseSubtle' : ''
                            } ${fontSizeClass} transition-all duration-200`}
                            aria-label={`${label} amount in ${
                                token?.symbol || 'tokens'
                            }`}
                            autoFocus={autoFocus}
                        />
                    )}

                    {/* Token Selector or Mobile Quick Select */}
                    {isMobile && !token ? (
                        // Mobile Quick Select Preview
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {popularTokens.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => onTokenSelect(t)}
                                    className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                    aria-label={`Select ${t.name} (${t.symbol})`}
                                >
                                    <div
                                        className={`w-7 h-7 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                                        aria-hidden="true"
                                    >
                                        {t.logo}
                                    </div>
                                </button>
                            ))}
                            {/* Custom "Select token" button for mobile */}
                            <Button
                                onClick={() => setIsSelectorOpen(true)}
                                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full h-auto focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex-shrink-0"
                            >
                                Select token
                            </Button>
                        </div>
                    ) : (
                        // Desktop or selected token view: use EnhancedTokenSelector's default button
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
                    )}
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
