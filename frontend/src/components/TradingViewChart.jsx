import React, { useEffect, useRef, useState } from "react";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming.js";
import Datafeed from "./datafeed.js"; // Custom TradingView Datafeed

const TradingViewChart = () => {
  const chartRef = useRef(null);
  const [socketData, setSocketData] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!window.TradingView) {
      console.error("TradingView library not loaded!");
      return;
    }

    if (chartRef.current) {
      chartRef.current.innerHTML = ""; // ✅ Clear previous chart before reloading
    }

    new window.TradingView.widget({
      container_id: "tradingview-chart",
      autosize: true,
      symbol: "CustomExchange:BTC/USD", // ✅ Default Symbol
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      hide_top_toolbar: false,
      enable_publishing: true,
      allow_symbol_change: false,
      save_image: true,
      withdateranges: true,
      studies: [],
      locale: "en",
      toolbar_bg: "#131722",
      hide_side_toolbar: false,
      hide_volume: true,
      datafeed: Datafeed, // ✅ Use Custom DataFeed
    });
  }, []);

  useEffect(() => {
    if (wsRef.current) return; // ✅ Prevent multiple WebSocket instances
    wsRef.current = new WebSocket("ws://localhost:5000");

    wsRef.current.onopen = () => {
      console.log("[WebSocket] Connected to backend");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const marketData = JSON.parse(event.data);
        console.log("[WebSocket] Market Data Received:", marketData);

        if (marketData.candles) {
          setSocketData(marketData.candles);
          subscribeOnStream("CustomExchange:BTC/USD", "1", marketData.candles);
        }
      } catch (error) {
        console.error("[WebSocket] Error parsing data:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("[WebSocket] Error:", error);
    };

    wsRef.current.onclose = () => {
      console.warn("[WebSocket] Disconnected. Retrying in 3s...");
      setTimeout(() => {
        wsRef.current = new WebSocket("ws://localhost:5000");
      }, 3000);
    };

    return () => wsRef.current.close();
  }, []);

  return (
    <div className="w-full h-screen">
      <div id="tradingview-chart" ref={chartRef} className="h-full w-full" />
    </div>
  );
};

export default TradingViewChart;
