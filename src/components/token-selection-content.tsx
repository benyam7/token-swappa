import { Button } from '@/components/ui/button';
import {
    ChevronDown,
    Search,
    X,
    Clock,
    TrendingUp,
    ArrowUpDown,
} from 'lucide-react';
import type { Token, Chain } from '@/types/token';
import { chains } from '@/data/chains';
import { topTokens } from '@/data/tokens';
import { Shimmer, TokenShimmer } from './shimmer';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface TokenSelectionContentProps {
    tokens: Token[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    onTokenSelect: (token: Token) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedChain: Chain;
    setSelectedChain: (chain: Chain) => void;
    recentSearches: Token[];
    idPrefix: string;
    onClose: () => void;
}

export function TokenSelectionContent({
    tokens,
    loading,
    error,
    onRetry,
    onTokenSelect,
    searchQuery,
    setSearchQuery,
    selectedChain,
    setSelectedChain,
    recentSearches,
    idPrefix,
    onClose,
}: TokenSelectionContentProps) {
    const filteredTokens = tokens.filter(
        (token) =>
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const tokensByVolume = [...tokens].sort(
        (a, b) => (b.volume24h || 0) - (a.volume24h || 0)
    );

    const handleSelectAndClose = (token: Token) => {
        onTokenSelect(token);
        onClose();
    };

    const searchInputId = `${idPrefix}-token-search-input`;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                <h2
                    id={`${idPrefix}-token-selector-dialog-title`}
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                >
                    Select a token
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    aria-label="Close token selection dialog"
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Search and Chain Selector */}
            <div className="p-4 border-b dark:border-gray-700">
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <label htmlFor={searchInputId} className="sr-only">
                            Search tokens
                        </label>
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
                            aria-hidden="true"
                        />
                        <input
                            id={searchInputId}
                            type="text"
                            placeholder="Search tokens"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                            aria-label="Search tokens"
                        />
                    </div>
                </div>

                {/* Top Tokens */}
                {!searchQuery && (
                    <div
                        className="grid grid-cols-4 gap-3"
                        role="group"
                        aria-label="Popular tokens"
                    >
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className="flex flex-col items-center p-3 rounded-xl border"
                                      aria-hidden="true"
                                  >
                                      <Shimmer className="w-12 h-12 rounded-full mb-2" />
                                      <Shimmer className="h-3 w-12" />
                                  </div>
                              ))
                            : topTokens.map((tokenTemplate) => {
                                  const token = tokens.find(
                                      (t) => t.id === tokenTemplate.id
                                  );
                                  if (!token) return null;
                                  return (
                                      <button
                                          key={token.id}
                                          onClick={() =>
                                              handleSelectAndClose(token)
                                          }
                                          className="flex flex-col items-center p-3 rounded-xl border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                          aria-label={`Select ${token.name} (${token.symbol})`}
                                      >
                                          <div
                                              className="relative mb-2"
                                              aria-hidden="true"
                                          >
                                              <div
                                                  className={cn(
                                                      'w-12 h-12 rounded-full flex items-center justify-center overflow-hidden',
                                                      token.color
                                                          ? token.color
                                                          : 'bg-transparent'
                                                  )}
                                              >
                                                  {token.logo}
                                              </div>
                                              <div
                                                  className={cn(
                                                      'absolute -bottom-1 -right-1 w-4 h-4  rounded-full flex items-center justify-center bg-gray-500'
                                                  )}
                                              >
                                                  <span className="text-xs dark:text-white text-black">
                                                      {token.chainLogo}
                                                  </span>
                                              </div>
                                          </div>
                                          <span className="text-sm font-semibold dark:text-gray-100">
                                              {token.symbol}
                                          </span>
                                      </button>
                                  );
                              })}
                    </div>
                )}
            </div>

            <div
                className="flex-1 overflow-y-auto"
                role="region"
                aria-live="polite"
            >
                {/* Recent Searches */}
                {!searchQuery && recentSearches.length > 0 && (
                    <div className="p-4 border-b dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Clock
                                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                                    aria-hidden="true"
                                />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Recent searches
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-200"
                                aria-label="Clear recent searches"
                            >
                                Clear
                            </Button>
                        </div>
                        {recentSearches.map((token) => (
                            <button
                                key={token.id}
                                onClick={() => handleSelectAndClose(token)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                aria-label={`Select ${token.name} (${token.symbol})`}
                            >
                                <div
                                    className="relative mb-2"
                                    aria-hidden="true"
                                >
                                    <div
                                        className={cn(
                                            'w-12 h-12 rounded-full flex items-center justify-center overflow-hidden',
                                            token.color
                                                ? token.color
                                                : 'bg-transparent'
                                        )}
                                    >
                                        {token.logo}
                                    </div>
                                    <div
                                        className={cn(
                                            'absolute -bottom-1 -right-1 w-4 h-4  rounded-full flex items-center justify-center bg-gray-500'
                                        )}
                                    >
                                        <span className="text-xs dark:text-white text-black">
                                            {token.chainLogo}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                        {token.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {token.symbol}{' '}
                                        {token.contractAddress &&
                                            `${token.contractAddress.slice(
                                                0,
                                                6
                                            )}...${token.contractAddress.slice(
                                                -4
                                            )}`}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div
                        className="p-4 text-center"
                        role="alert"
                        aria-live="assertive"
                    >
                        <p className="text-red-600 dark:text-red-300 mb-2">
                            Failed to load tokens: {error}
                        </p>
                        <Button
                            onClick={onRetry}
                            variant="outline"
                            size="sm"
                            className="focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 bg-transparent dark:text-red-300 dark:hover:text-red-100"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Tokens by Volume */}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp
                            className="w-4 h-4 text-gray-600 dark:text-gray-400"
                            aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {searchQuery
                                ? 'Search Results'
                                : 'Tokens by 24H volume'}
                        </span>
                    </div>

                    {loading && !error
                        ? Array.from({ length: 6 }).map((_, i) => (
                              <TokenShimmer key={i} aria-hidden="true" />
                          ))
                        : (searchQuery ? filteredTokens : tokensByVolume).map(
                              (token) => (
                                  <button
                                      key={token.id}
                                      onClick={() =>
                                          handleSelectAndClose(token)
                                      }
                                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                      aria-label={`Select ${token.name} (${
                                          token.symbol
                                      }). Price: ${formatCurrency(
                                          token.price
                                      )}. 24 hour change: ${
                                          token.priceChange24h
                                              ? `${
                                                    token.priceChange24h >= 0
                                                        ? '+'
                                                        : ''
                                                }${token.priceChange24h.toFixed(
                                                    2
                                                )}%`
                                              : 'N/A'
                                      }`}
                                  >
                                      <div
                                          className="relative mb-2"
                                          aria-hidden="true"
                                      >
                                          <div
                                              className={cn(
                                                  'w-12 h-12 rounded-full flex items-center justify-center overflow-hidden',
                                                  token.color
                                                      ? token.color
                                                      : 'bg-transparent'
                                              )}
                                          >
                                              {token.logo}
                                          </div>
                                          <div
                                              className={cn(
                                                  'absolute -bottom-1 -right-1 w-4 h-4  rounded-full flex items-center justify-center bg-gray-500'
                                              )}
                                          >
                                              <span className="text-xs dark:text-white text-black">
                                                  {token.chainLogo}
                                              </span>
                                          </div>
                                      </div>
                                      <div className="flex-1 text-left">
                                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                                              {token.name}
                                          </div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400">
                                              {token.symbol}
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          <div className="text-sm font-medium dark:text-gray-100">
                                              {formatCurrency(token.price)}
                                          </div>
                                          <div
                                              className={`text-xs ${
                                                  token.priceChange24h &&
                                                  token.priceChange24h >= 0
                                                      ? 'text-green-600'
                                                      : 'text-red-600'
                                              } dark:text-gray-400`}
                                          >
                                              {token.priceChange24h
                                                  ? `${
                                                        token.priceChange24h >=
                                                        0
                                                            ? '+'
                                                            : ''
                                                    }${token.priceChange24h.toFixed(
                                                        2
                                                    )}%`
                                                  : ''}
                                          </div>
                                      </div>
                                  </button>
                              )
                          )}
                    {!loading &&
                        !error &&
                        (searchQuery ? filteredTokens : tokensByVolume)
                            .length === 0 && (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                                No tokens found.
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
