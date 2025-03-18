

const socket = new WebSocket("ws://localhost:5000");
const channelToSubscription = new Map();

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log("[WebSocket] Market Data Received:", data);

  if (!data || !data.candles) return;

  data.candles.forEach((candle) => {
    const fullSymbol = "CustomExchange:BTC/USD";  // ✅ Update BTC/USD only
    const subscriptionItem = channelToSubscription.get(fullSymbol);
    if (!subscriptionItem) return;

    const lastBar = subscriptionItem.lastBar || candle;
    const updatedBar = {
      ...lastBar,
      high: Math.max(lastBar.high, candle.high),
      low: Math.min(lastBar.low, candle.low),
      close: candle.close,
    };

    subscriptionItem.lastBar = updatedBar;
    subscriptionItem.handlers.forEach((handler) => handler(updatedBar));
  });
});

export function subscribeOnStream(symbol, resolution, marketData) {
  console.log(`[subscribeBars]: Subscribing to real-time updates for ${symbol}`);

  const fullSymbol = "CustomExchange:BTC/USD";
  const handler = { callback: (bar) => console.log("[TradingView] New Bar:", bar) };

  let subscriptionItem = channelToSubscription.get(fullSymbol);
  if (!subscriptionItem) {
    subscriptionItem = { lastBar: marketData[marketData.length - 1], handlers: [handler] };
    channelToSubscription.set(fullSymbol, subscriptionItem);
  } else {
    subscriptionItem.handlers.push(handler);
  }
}

export function unsubscribeFromStream(symbol) {
  console.log("[unsubscribeBars]: Unsubscribing:", symbol);
  channelToSubscription.delete(symbol);
}
