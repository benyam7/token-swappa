import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { Token, Chain } from '@/types/token';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { TokenSelectionContent } from '@/components/token-selection-content';
import { chains } from '@/data/chains';
import { cn } from '@/lib/utils';

interface EnhancedTokenSelectorProps {
    selectedToken: Token | null;
    onTokenSelect: (token: Token) => void;
    placeholder?: string;
    tokens: Token[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    idPrefix: string;
    // Make isOpen and setIsOpen controlled props
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    className?: string; // Added className prop
}

export function EnhancedTokenSelector({
    selectedToken,
    onTokenSelect,
    placeholder,
    tokens,
    loading,
    error,
    onRetry,
    idPrefix,
    isOpen, // Controlled prop
    setIsOpen, // Controlled prop
    className, // Destructure className
}: EnhancedTokenSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChain, setSelectedChain] = useState<Chain>(chains[0]);
    const [recentSearches] = useState<Token[]>(tokens.slice(0, 3));

    const dialogRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const isMobile = useIsMobile();

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
        triggerRef.current?.focus();
    };

    const handleTokenSelectAndClose = (token: Token) => {
        onTokenSelect(token);
        handleClose();
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && dialogRef.current) {
            dialogRef.current.focus();
        }
    }, [isOpen]);

    const dialogId = `${idPrefix}-token-selector-dialog`;

    return (
        <div className={`relative ${className}`}>
            <Button
                id={`${idPrefix}-token-select-button`}
                ref={triggerRef}
                onClick={() => setIsOpen(true)} // Always set to true to open
                className={`flex items-center gap-2 rounded-full px-3 py-2 h-auto focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                    selectedToken
                        ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                        : 'bg-pink-500 hover:bg-pink-600 text-white' // Apply pink color when no token is selected
                }`}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls={dialogId}
            >
                {selectedToken ? (
                    <>
                        <div className="relative">
                            <div
                                className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center overflow-hidden',
                                    selectedToken.color
                                        ? selectedToken.color
                                        : 'bg-transparent'
                                )}
                                aria-hidden="true"
                            >
                                {selectedToken.logo}
                            </div>
                            {selectedToken.chainLogo && (
                                <div
                                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center text-black"
                                    aria-hidden="true"
                                >
                                    <span className="text-xs text-black">
                                        {selectedToken.chainLogo}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className="font-semibold">
                            {selectedToken.symbol}
                        </span>
                    </>
                ) : (
                    <span className="font-semibold">
                        {placeholder || 'Select token'}
                    </span>
                )}
                <ChevronDown
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    aria-hidden="true"
                />
            </Button>

            {/* Overlay - always rendered, animated opacity */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-200 ${
                    isOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
                onClick={handleClose}
                aria-hidden="true"
            />

            {isMobile ? (
                // Mobile Drawer - always rendered, animated transform and opacity
                <div
                    id={dialogId}
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`${dialogId}-title`}
                    className={`fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden transition-all duration-300 ease-out ${
                        isOpen
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-full opacity-0 pointer-events-none'
                    } focus:outline-none`}
                    tabIndex={-1}
                >
                    <TokenSelectionContent
                        tokens={tokens}
                        loading={loading}
                        error={error}
                        onRetry={onRetry}
                        onTokenSelect={handleTokenSelectAndClose}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedChain={selectedChain}
                        setSelectedChain={setSelectedChain}
                        recentSearches={recentSearches}
                        idPrefix={idPrefix}
                        onClose={handleClose}
                    />
                </div>
            ) : (
                // Desktop Dialog - always rendered, animated transform and opacity
                <div
                    id={dialogId}
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`${dialogId}-title`}
                    className={`fixed inset-4 z-50 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md mx-auto max-h-[90vh] overflow-hidden transition-all duration-200 ease-out origin-bottom-right ${
                        isOpen
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-95 pointer-events-none'
                    } focus:outline-none`}
                    tabIndex={-1}
                >
                    <TokenSelectionContent
                        tokens={tokens}
                        loading={loading}
                        error={error}
                        onRetry={onRetry}
                        onTokenSelect={handleTokenSelectAndClose}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedChain={selectedChain}
                        setSelectedChain={setSelectedChain}
                        recentSearches={recentSearches}
                        idPrefix={idPrefix}
                        onClose={handleClose}
                    />
                </div>
            )}
        </div>
    );
}
