import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

const CandlestickChart = () => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [candleData, setCandleData] = useState([]);

  const API_URL =
    "https://api.ape.pro/api/v2/charts/4AMZofMonqndgZ4ePk7XCiRuf1Q4HiPq2n96Jg3bpump?interval=1_MINUTE&baseAsset=4AMZofMonqndgZ4ePk7XCiRuf1Q4HiPq2n96Jg3bpump&quote=fiat%2Fusd&from=2025-02-19T09%3A50%3A22.000Z&to=2025-02-19T15%3A19%3A22.000Z&candles=329&type=price";

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.candles) {
          const formattedData = data.candles.map((item) => ({
            time: item.time, // Ensure Unix timestamp in seconds
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }));

          setCandleData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching candle data:", error);
      }
    };

    fetchCandleData();
  }, []);

 useEffect(() => {
  if (!chartContainerRef.current || candleData.length === 0) return;

  if (!chartInstanceRef.current) {
    chartInstanceRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { backgroundColor: "#253248", textColor: "white" },
      grid: { vertLines: { color: "#334158" }, horzLines: { color: "#334158" } },
      crosshair: { mode: CrosshairMode.Normal },
      priceScale: { borderColor: "#485c7b" },
      timeScale: { borderColor: "#485c7b" },
    });

    console.log("Chart instance created:", chartInstanceRef.current);
  }

  if (chartInstanceRef.current && typeof chartInstanceRef.current.addCandlestickSeries === "function") {
    candleSeriesRef.current = chartInstanceRef.current.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });

    console.log("Candle series created:", candleSeriesRef.current);
    candleSeriesRef.current.setData(candleData);
  } else {
    console.error("Error: Chart instance is invalid or addCandlestickSeries is not available.", chartInstanceRef.current);
  }

  return () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }
  };
}, [candleData]);


  return <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />;
};

export default CandlestickChart;
