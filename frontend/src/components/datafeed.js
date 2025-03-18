import { makeApiRequest, generateSymbol, parseFullSymbol } from "./helpers.js";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming.js";

const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ["1", "5", "15", "60", "D"],
  exchanges: [{ value: "CustomExchange", name: "CustomExchange", desc: "Custom Market" }],
  symbols_types: [{ name: "crypto", value: "crypto" }],
};

export default {
  onReady: (callback) => {
    console.log("[onReady]: TradingView Datafeed Ready");
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("[searchSymbols]: Searching for symbols");

    const symbols = [
      generateSymbol("CustomExchange", "BTC", "USD"),
      generateSymbol("CustomExchange", "ETH", "USD"),
    ];

    onResultReadyCallback(
      symbols.map((symbol) => ({
        symbol: symbol.short,
        full_name: symbol.full,
        exchange: "CustomExchange",
        type: "crypto",
      }))
    );
  },

resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
  console.log("[resolveSymbol]: Resolving symbol", symbolName);

  // ✅ Ensure correct symbol format
  const supportedSymbols = {
    "BTC/USD": "CustomExchange:BTC/USD",
    "ETH/USD": "CustomExchange:ETH/USD",
  };

  const fullSymbol = supportedSymbols[symbolName] || null;

  if (!fullSymbol) {
    console.error("[resolveSymbol]: Invalid Symbol", symbolName);
    onResolveErrorCallback("Symbol not found");
    return;
  }

  const symbolInfo = {
    ticker: fullSymbol,
    name: symbolName,
    description: `${symbolName} Market`,
    type: "crypto",
    session: "24x7",
    timezone: "Etc/UTC",
    exchange: "CustomExchange",
    minmov: 1,
    pricescale: 100,
    has_intraday: true,
    has_no_volume: false,
    supported_resolutions: ["1", "5", "15", "60", "D"],
    data_status: "streaming",
  };

  console.log("[resolveSymbol]: Resolved Symbol", symbolInfo);
  onSymbolResolvedCallback(symbolInfo);
},


 getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) => {
  console.log("[getBars]: Fetching historical data for", symbolInfo.name);

  try {
    const response = await makeApiRequest("market-data");
    if (!response || response.length === 0) {
      console.warn("[getBars]: No data available.");
      onHistoryCallback([], { noData: true });
      return;
    }

    // ✅ Ensure correct data format for TradingView
    const bars = response.map((candle) => ({
      time: candle.time * 1000,  // Convert seconds to milliseconds
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume || 0,
    }));

    console.log("[getBars]: Sending bars to TradingView", bars);
    onHistoryCallback(bars, { noData: false });
  } catch (error) {
    console.error("[getBars]: Error fetching data", error);
    onErrorCallback(error);
  }
},


  /** ✅ Subscribing to real-time updates */
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID) => {
    console.log(`[subscribeBars]: Subscribing to real-time updates for ${symbolInfo.full_name}`);

    const lastBar = lastBarsCache.get(symbolInfo.full_name) || null;
    subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, lastBar);
  },

  /** ✅ Unsubscribing from real-time updates */
  unsubscribeBars: (subscriberUID) => {
    console.log(`[unsubscribeBars]: Unsubscribing from real-time updates for UID: ${subscriberUID}`);
    unsubscribeFromStream(subscriberUID);
  },
};
