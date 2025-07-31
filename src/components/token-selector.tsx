import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search } from 'lucide-react';
import type { Token } from '@/types/token';
import { tokens } from '@/data/tokens';

interface TokenSelectorProps {
    selectedToken: Token | null;
    onTokenSelect: (token: Token) => void;
    placeholder?: string;
}

export function TokenSelector({
    selectedToken,
    onTokenSelect,
    placeholder,
}: TokenSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTokens = tokens.filter(
        (token) =>
            token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTokenSelect = (token: Token) => {
        onTokenSelect(token);
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-2 h-auto"
            >
                {selectedToken ? (
                    <>
                        <div
                            className={`w-6 h-6 ${selectedToken.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                        >
                            {selectedToken.logo}
                        </div>
                        <span className="font-semibold text-gray-900">
                            {selectedToken.symbol}
                        </span>
                    </>
                ) : (
                    <span className="font-semibold text-gray-600">
                        {placeholder || 'Select token'}
                    </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-600" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-lg border z-20 w-80">
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tokens..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {filteredTokens.map((token) => (
                                    <button
                                        key={token.symbol}
                                        onClick={() => handleTokenSelect(token)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <div
                                            className={`w-8 h-8 ${token.color} rounded-full flex items-center justify-center text-white font-bold`}
                                        >
                                            {token.logo}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-semibold text-gray-900">
                                                {token.symbol}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {token.name}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            ${token.price.toLocaleString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
