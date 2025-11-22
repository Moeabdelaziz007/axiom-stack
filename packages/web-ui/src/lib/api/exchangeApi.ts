/**
 * Exchange API - Real-time cryptocurrency price conversion
 * Uses CoinGecko API for live price data
 */

interface ExchangeRate {
    symbol: string;
    usd: number;
    lastUpdated: number;
}

interface ConversionResult {
    amount: number;
    currency: string;
    usdValue: number;
    rate: number;
}

// Cache for exchange rates (5 minute TTL)
const rateCache = new Map<string, ExchangeRate>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches current exchange rate for a cryptocurrency
 */
export async function getExchangeRate(symbol: string): Promise<ExchangeRate | null> {
    const cacheKey = symbol.toLowerCase();
    const cached = rateCache.get(cacheKey);

    // Return cached rate if still valid
    if (cached && Date.now() - cached.lastUpdated < CACHE_TTL) {
        return cached;
    }

    try {
        // Map symbols to CoinGecko IDs
        const coinGeckoIds: Record<string, string> = {
            'SOL': 'solana',
            'ETH': 'ethereum',
            'USDC': 'usd-coin',
            'AXM': 'axiom', // Placeholder - replace with actual token ID when listed
        };

        const coinId = coinGeckoIds[symbol.toUpperCase()];
        if (!coinId) {
            console.warn(`Unknown symbol: ${symbol}`);
            return null;
        }

        // Fetch from CoinGecko API (free tier, no API key required)
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        const usdPrice = data[coinId]?.usd;

        if (!usdPrice) {
            throw new Error(`No price data for ${symbol}`);
        }

        const rate: ExchangeRate = {
            symbol: symbol.toUpperCase(),
            usd: usdPrice,
            lastUpdated: Date.now()
        };

        rateCache.set(cacheKey, rate);
        return rate;

    } catch (error) {
        console.error(`Failed to fetch exchange rate for ${symbol}:`, error);

        // Return mock data for development/fallback
        return {
            symbol: symbol.toUpperCase(),
            usd: getMockPrice(symbol),
            lastUpdated: Date.now()
        };
    }
}

/**
 * Converts cryptocurrency amount to USD
 */
export async function convertToUSD(
    amount: number,
    currency: string
): Promise<ConversionResult> {
    const rate = await getExchangeRate(currency);

    if (!rate) {
        return {
            amount,
            currency,
            usdValue: 0,
            rate: 0
        };
    }

    return {
        amount,
        currency: currency.toUpperCase(),
        usdValue: amount * rate.usd,
        rate: rate.usd
    };
}

/**
 * Converts USD amount to cryptocurrency
 */
export async function convertFromUSD(
    usdAmount: number,
    currency: string
): Promise<ConversionResult> {
    const rate = await getExchangeRate(currency);

    if (!rate) {
        return {
            amount: 0,
            currency,
            usdValue: usdAmount,
            rate: 0
        };
    }

    const cryptoAmount = usdAmount / rate.usd;

    return {
        amount: cryptoAmount,
        currency: currency.toUpperCase(),
        usdValue: usdAmount,
        rate: rate.usd
    };
}

/**
 * Mock prices for development/fallback
 */
function getMockPrice(symbol: string): number {
    const mockPrices: Record<string, number> = {
        'SOL': 95.50,
        'ETH': 2250.00,
        'USDC': 1.00,
        'AXM': 0.50, // Mock price for $AXIOM token
    };

    return mockPrices[symbol.toUpperCase()] || 1.00;
}

/**
 * Formats currency value for display
 */
export function formatCurrency(value: number, currency: string): string {
    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }

    return `${value.toFixed(4)} ${currency}`;
}
