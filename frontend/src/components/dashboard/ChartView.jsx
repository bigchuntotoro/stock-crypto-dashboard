import React, { useEffect, useRef } from "react";

export default function ChartView({ symbol = "NASDAQ:AAPL" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. 기존에 생성된 위젯이 있다면 깨끗이 비웁니다 (중복 렌더링 및 충돌 방지)
    container.innerHTML = "";

    // 2. 새로운 위젯 래퍼 div 생성
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";
    container.appendChild(widgetContainer);

    // 3. TradingView 스크립트 생성 및 설정
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol, // props로 전달받은 심볼 사용 (없으면 기본값)
      interval: "D",
      timezone: "Asia/Seoul",
      theme: "dark",
      style: "1",
      locale: "kr",
      enable_publishing: false,
      hide_top_toolbar: false,
      save_image: false,
      support_host: "https://www.tradingview.com",
    });

    widgetContainer.appendChild(script);

    // 4. 컴포넌트가 사라질 때 정리 (Cleanup)
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [symbol]); // symbol이 바뀔 때만 차트가 새로고침되도록 설정

  return (
    // 차트 높이를 뷰포트 기준으로 크게 확보 (최소 680px, 최대한 화면을 채우도록 70vh)
    <div
      className="chart-view"
      style={{ height: "70vh", minHeight: "680px", width: "100%" }}
    >
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
