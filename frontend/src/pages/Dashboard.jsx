import React, { useState } from "react";

import Header from "../components/common/Header";
import ChartView from "../components/dashboard/ChartView";
import OrderForm from "../components/dashboard/OrderForm";
import Portfolio from "../components/dashboard/Portfolio";

// 새로 작성한 스타일시트. 파일을 Dashboard.jsx와 같은 폴더에 두거나,
// 경로가 다르다면 이 import 경로만 프로젝트 구조에 맞게 수정하세요.
import "../styles/Dashboard.css";

// 주문/차트에서 다룰 종목 목록입니다.
// 지금은 샘플 데이터이며, 실제로는 API에서 받아온 시세로 교체하면 됩니다.
// - symbol: 주문 API로 그대로 전송되는 값 (DB orders.symbol 컬럼)
// - tvSymbol: TradingView 차트 위젯에 넘기는 심볼 형식
const TRADABLE_INSTRUMENTS = [
  {
    symbol: "360750",
    tvSymbol: "AMEX:SPY",
    name: "TIGER 미국S&P500",
    price: 19250,
  },
  {
    symbol: "133690",
    tvSymbol: "NASDAQ:QQQ",
    name: "TIGER 미국나스닥100",
    price: 22800,
  },
  {
    symbol: "379800",
    tvSymbol: "AMEX:SCHD",
    name: "KODEX 미국배당다우존스",
    price: 12450,
  },
  {
    symbol: "452380",
    tvSymbol: "NASDAQ:TSLA",
    name: "TIGER 미국테슬라채권혼합",
    price: 11200,
  },
  {
    symbol: "441680",
    tvSymbol: "AMEX:JEPQ",
    name: "ACE 미국배당커버드콜",
    price: 11500,
  },
  {
    symbol: "462290",
    tvSymbol: "NASDAQ:NVDA",
    name: "KODEX 미국AI테크TOP10",
    price: 17800,
  },
  {
    symbol: "476570",
    tvSymbol: "NASDAQ:SOX",
    name: "TIGER 미국필라델피아반도체",
    price: 24100,
  },
  {
    symbol: "448290",
    tvSymbol: "NASDAQ:TLT",
    name: "KODEX 미국채울트라30년선물(H)",
    price: 9500,
  },
  {
    symbol: "423160",
    tvSymbol: "NYSE:AAPL",
    name: "TIGER 미국테크TOP10",
    price: 16200,
  },
  {
    symbol: "411420",
    tvSymbol: "NASDAQ:QQQ",
    name: "ACE 미국나스닥100",
    price: 19800,
  },
  {
    symbol: "478470",
    tvSymbol: "AMEX:SPY",
    name: "RISE 미국S&P500",
    price: 15100,
  },
  {
    symbol: "487440",
    tvSymbol: "AMEX:MAGS",
    name: "TIGER 미국S&P500매그니피센트7",
    price: 13900,
  },
];

const Dashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(
    TRADABLE_INSTRUMENTS[0].symbol,
  );

  const selectedInstrument =
    TRADABLE_INSTRUMENTS.find((item) => item.symbol === selectedSymbol) ||
    TRADABLE_INSTRUMENTS[0];

  return (
    <div className="dashboard-page">
      {/* =========================================================
          상단 헤더
         ========================================================= */}
      <Header />

      {/* =========================================================
          메인 컨텐츠
         ========================================================= */}
      <main className="dashboard-container">
        {/* 페이지 타이틀 */}
        <section className="dashboard-title-section">
          <div>
            <h1 className="dashboard-title">Stock & Crypto Dashboard</h1>

            <p className="dashboard-subtitle">
              실시간 시세와 포트폴리오를 한눈에 확인하세요.
            </p>
          </div>

          <div className="market-status">
            <span className="market-status-dot"></span>
            <span>실시간 연결</span>
          </div>
        </section>

        {/* =======================================================
            포트폴리오 요약
           ======================================================= */}
        <section className="dashboard-section portfolio-section">
          <div className="section-header">
            <div>
              <h2>포트폴리오</h2>
              <p>보유 자산과 수익률을 확인하세요.</p>
            </div>
          </div>

          <div className="portfolio-card">
            <Portfolio />
          </div>
        </section>

        {/* =======================================================
            차트
           ======================================================= */}
        <section className="dashboard-section chart-section">
          <div className="section-header">
            <div>
              <h2>시장 차트</h2>
              <p>ETF 종목을 선택하고 원하는 기간의 차트를 확인하세요.</p>
            </div>

            <select
              className="symbol-select"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
            >
              {TRADABLE_INSTRUMENTS.map((item) => (
                <option key={item.symbol} value={item.symbol}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="chart-card">
            <ChartView symbol={selectedInstrument.tvSymbol} />
          </div>
        </section>

        {/* =======================================================
            주문
           ======================================================= */}
        <section className="dashboard-section order-section">
          <div className="section-header">
            <div>
              <h2>주문</h2>
              <p>주식 및 암호화폐 주문을 관리합니다.</p>
            </div>
          </div>

          <div className="order-card">
            <OrderForm
              symbol={selectedInstrument.symbol}
              currentPrice={selectedInstrument.price}
              name={selectedInstrument.name}
            />
          </div>
        </section>
      </main>

      {/* =========================================================
          Footer
         ========================================================= */}
      <footer className="dashboard-footer">
        <div className="dashboard-footer-inner">
          <span>Stock & Crypto Dashboard</span>
          <span>Market Data · Portfolio · Trading</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
