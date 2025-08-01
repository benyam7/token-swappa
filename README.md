# Token Swappa 🔄

A modern, accessible token swap interface built with React and TypeScript. Features real-time price updates, dual API fallback, and a polished user experience with dark/light theme support.

![Token Swappa Interface](https://via.placeholder.com/600x400/1e293b/10b981?text=Token+Swappa+Interface)

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd token-swapa
pnpm install

# Start development server
pnpm run dev
```

That's it! The app will be running at `http://localhost:5173`

## ✨ Features

- **Real-time Price Updates**: Dual API strategy with FunKit primary and CoinGecko fallback
- **Bidirectional Calculation**: Edit amounts in either direction with instant recalculation
- **Responsive Design**: Optimized for mobile and desktop experiences
- **Theme Support**: Dark/light mode with system preference detection
- **Quick Token Selection**: Hover-activated quick selector for popular tokens
- **Number Formatting**: Input and display values are formatted with comma separators and appropriate decimal precision for improved readability (`lib/formatters.ts`).
- **Error Resilience**: Graceful error handling with retry mechanisms

**Modularity and Reusability**:
  -   **Component-Based Architecture**: The UI is broken down into small, reusable React components (e.g., `TokenInput`, `EnhancedTokenSelector`, `QuickTokenSelector`, `TokenSelectionContent`, `Shimmer`).
    -   **Custom Hooks**: Logic is encapsulated in custom hooks (`useCoinGeckoPrice`, `useIsMobile`, `useTheme`) to promote reusability and separation of concerns.
    -   **Utility Functions**: Helper functions for formatting (`lib/formatters.ts`) are separated for clean code.

**Theming**:
    -   **Light/Dark Mode**: Implemented using `next-themes` and Tailwind CSS `dark:` variants, allowing users to switch between themes or default to their system preference. This ensures a consistent visual experience across different lighting conditions.


## 🎯 Design Philosophy
### Robust Price Data Strategy
The app uses a sophisticated dual-API approach:
1. **Primary Source**: FunKit API for real-time institutional-grade pricing
2. **Automatic Fallback**: CoinGecko API when FunKit is unavailable or returns invalid data
3. **Data Validation**: Ensures price data integrity before displaying to users
4. **Polling Strategy**: 5-minute intervals to balance freshness with API limits

### Modular Architecture
```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks for data fetching
├── data/               # Token and chain configurations
├── types/              # TypeScript type definitions
└── lib/                # Utility functions and formatters
```



## 🏗️ Key Assumptions & Decisions

### Token Selection
- **Limited Scope**: Focused on few core tokens (ETH, USDC, USDT, DAI etc) listed in `/data/tokens.ts` for MVP simplicity
- **Pluggable Design**: Token selector architecture allows easy expansion to hundreds of tokens
- **Multi-Chain Support**: Built with cross-chain swapping in mind (currently Ethereum-focused)

### UI/UX Choices
- **Emoji Icons**: Used emoji representations instead of actual token logos for faster loading and consistency
- **Bidirectional Editing**: Users can edit either "from" or "to" amounts naturally
- **USD Toggle**: Optional USD value display for better price comprehension
- **Visual Feedback**: Shimmer effects and loading states for perceived performance

- **Autofocus on source input**: so user can start typing right away

### Technical Decisions
-  **Token List**: The initial token list is hardcoded in `data/tokens.ts` for demonstration purposes. However, the `EnhancedTokenSelector` component is designed to be pluggable, meaning it can easily integrate with a dynamic list of tokens fetched from an external source (e.g., a blockchain indexer or a more comprehensive API) without significant changes to the core swap logic.
- **Price Data Source**: CoinGecko's API (`api.coingecko.com/api/v3/simple/price`) is used for fetching token prices. It's assumed that this endpoint provides sufficient data for the required price, 24-hour change, and volume information.
- **No Wallet Integration/Blockchain Interaction**: This project focuses purely on the user interface and client-side logic for calculating swap amounts and displaying information. It does **not** include actual Web3 wallet connection, transaction signing, or direct interaction with a blockchain. The "Review swap" button is a placeholder for where such functionality would be initiated.
- **No Backend**: All data fetching (CoinGecko prices) is done directly from the client-side. There is no custom backend server involved.


### API Integration
- **Environment Variables**: API keys stored securely in environment variables
- **Error Boundaries**: Graceful degradation when price services are unavailable
- **Polling Strategy**: Background updates without disrupting user interaction
- **Rate Limiting**: Respectful API usage with appropriate intervals

## 🛠️ Development

### Scripts
```bash
pnpm run dev      # Start development server
pnpm run build    # Build for production
pnpm run preview  # Preview production build
pnpm run lint     # Run ESLint
```

### Environment Variables
Create a `.env.local` file:
```bash
VITE_FUNKIT_API_KEY=your_funkit_api_key
VITE_COINGECKO_API_KEY=your_coingecko_api_key
```

### Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom animations
- **Icons**: Lucide React
- **Theme**: Next-themes with system preference support
- **API Integration**: Native fetch with custom hooks

## 🎨 UI Components

The app features a component-driven architecture with:
- **TokenInput**: Reusable input component with integrated token selection
- **EnhancedTokenSelector**: Modal-based token picker with search and filtering
- **QuickTokenSelector**: Hover-activated popular token shortcuts
- **Theme Toggle**: Accessible dark/light mode switcher

## 🔮 Potential Enhancements
- **Blockchain Integration**: Connect to actual DEX protocols for real swapping
- **Realtime polling for current selected tokens**
- **More Tokens and chains**: Expand beyond the limited tokens and chains
- **Advanced Features**: Slippage tolerance, price impact warnings

---

Built with ❤️
