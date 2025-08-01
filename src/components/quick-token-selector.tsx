import type { Token } from '@/types/token';
import { popularTokens } from '@/data/tokens';

interface QuickTokenSelectorProps {
    onTokenSelect: (token: Token) => void;
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export function QuickTokenSelector({
    onTokenSelect,
    isVisible,
    onMouseEnter,
    onMouseLeave,
}: QuickTokenSelectorProps) {
    const delayStep = 50; // Milliseconds between each token's animation

    return (
        <div
            className={`absolute -top-10 right-0 flex justify-end gap-[0.5] z-10 p-1 ${
                isVisible ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="group"
            aria-label="Quick select tokens"
        >
            {popularTokens.map((token, index) => {
                // Calculate delay for right-to-left stagger
                // The rightmost token (last in array) gets 0 delay, then increases for tokens to its left
                const delay = (popularTokens.length - 1 - index) * delayStep;
                const animationClass = isVisible
                    ? 'animate-pop-in-right'
                    : 'animate-pop-out-right';

                return (
                    <button
                        key={token.id}
                        onClick={() => onTokenSelect(token as Token)}
                        className={`w-6 h-6 md:w-8 md:h-8bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-teal-300 hover:scale-110 transition-all duration-200 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${animationClass}`}
                        style={{ animationDelay: `${delay}ms` }} // Apply dynamic delay
                        title={token.name}
                        aria-label={`Select ${token.name} (${token.symbol})`}
                    >
                        <div
                            className="w-4 h-4 md:w-8 md:h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden"
                            aria-hidden="true"
                        >
                            <img
                                src={token.logo}
                                alt={`${token.name} logo`}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                    // Fallback to colored circle with symbol if image fails
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.className = `w-6 h-6 ${token.color} rounded-full flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform`;
                                        parent.textContent = token.symbol[0];
                                    }
                                }}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
