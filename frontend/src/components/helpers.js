// export const apiKey = "<your-crypto-compare-api-key>";

export async function makeApiRequest(path) {
  try {
    const url = new URL(`http://localhost:5000/${path}`); // ✅ Fetch from your backend, not CryptoCompare
    const response = await fetch(url.toString());
    return response.json();
  } catch (error) {
    throw new Error(`Market Data Request Error: ${error.message}`);
  }
}

// ✅ Generate symbol in the correct TradingView format
export function generateSymbol(exchange, fromSymbol, toSymbol) {
  return {
    short: `${fromSymbol}/${toSymbol}`,
    full: `${exchange}:${fromSymbol}/${toSymbol}`,
  };
}

// ✅ Ensure symbols are parsed correctly
export function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  };
}
