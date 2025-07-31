import './App.css';
import { ThemeProvider } from './components/theme-provider';
import { TokenSwappaApp } from './components/token-swappa-app';

function App() {
    return (
        <>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <TokenSwappaApp />
            </ThemeProvider>
        </>
    );
}

export default App;
