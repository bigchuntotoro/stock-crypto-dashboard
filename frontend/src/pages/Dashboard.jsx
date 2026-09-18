import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "../components/common/Header";
import ChartView from "../components/dashboard/ChartView";
import OrderForm from "../components/dashboard/OrderForm";
import Portfolio from "../components/dashboard/Portfolio";

// 새로 작성한 스타일시트. 파일을 Dashboard.jsx와 같은 폴더에 두거나,
// 경로가 다르다면 이 import 경로만 프로젝트 구조에 맞게 수정하세요.
import "../styles/Dashboard.css";

// 주문/차트에서 다룰 종목 목록입니다.
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

// =========================================================
// 사용자 계정 및 잔고 관리 서브 컴포넌트 (자릿수 콤마 적용)
// =========================================================
const AccountManager = ({ userId = 1, onCashUpdated }) => {
  const [cashInput, setCashInput] = useState(""); // 화면에 콤마가 포함되어 표시될 문자열 값
  const [rawCash, setRawCash] = useState(0); // 서버로 전송할 순수 숫자 값
  const [username, setUsername] = useState("");

  const fetchAccount = async () => {
    try {
      const response = await axios.get(`/api/account/${userId}`);
      if (response.data && response.data.cash !== undefined) {
        const value = response.data.cash;
        setRawCash(value);
        setCashInput(formatNumber(value)); // 불러온 값을 콤마 포맷으로 변환
        setUsername(response.data.username);
      }
    } catch (error) {
      console.error("계정 정보를 불러오지 못했습니다.", error);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [userId]);

  // 숫자에 천단위 콤마(,) 추가하는 함수
  const formatNumber = (value) => {
    if (value === "" || value === null || value === undefined) return "";
    return new Intl.NumberFormat("ko-KR").format(Number(value));
  };

  // 입력창 변경 핸들러 (콤마 자동 변환)
  const handleInputChange = (e) => {
    // 콤마(,)를 모두 제거하고 순수 숫자만 추출
    const valueWithoutComma = e.target.value.replace(/,/g, "");

    // 숫자가 아니면 빈 값 처리
    if (valueWithoutComma && isNaN(valueWithoutComma)) return;

    setRawCash(valueWithoutComma === "" ? 0 : Number(valueWithoutComma));
    setCashInput(formatNumber(valueWithoutComma)); // 콤마 포맷팅 적용하여 상태 저장
  };

  const handleCashUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/account/${userId}/cash`, { cash: Number(rawCash) });
      alert("투자 가동 현금 잔고가 성공적으로 변경되었습니다.");
      fetchAccount();
      if (onCashUpdated) onCashUpdated();
    } catch (error) {
      console.error("잔고 변경 실패:", error);
      alert("잔고 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="account-manager-card"
      style={{
        padding: "16px 20px",
        background: "#f8f9fa",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div>
        <h4 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
          사용자 계정: {username || "기본 사용자"}
        </h4>
        <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
          현재 잔고:{" "}
          <strong style={{ color: "#2f80ed" }}>{cashInput || 0}원</strong> (모의
          투자 초기 자산을 설정하세요)
        </p>
      </div>
      <form
        onSubmit={handleCashUpdate}
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        <input
          type="text" // 콤마 포맷 표시를 위해 text 타입 사용 (숫자만 입력되도록 처리됨)
          value={cashInput}
          onChange={handleInputChange}
          placeholder="금액 입력"
          style={{
            padding: "8px 12px",
            width: "180px",
            borderRadius: "4px",
            border: "1px solid #d1d5db",
            textAlign: "right",
          }}
          required
        />
        <span style={{ fontSize: "14px", fontWeight: "bold" }}>원</span>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#2f80ed",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          잔고 변경
        </button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(
    TRADABLE_INSTRUMENTS[0].symbol,
  );

  // 포트폴리오 및 잔고 새로고침을 위한 트리거 state
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOrderComplete = () => {
    // 주문 성공 시 key 값을 변경하여 <Portfolio /> 컴포넌트가 재렌더링 및 API 재호출을 하도록 유도
    setRefreshKey((prev) => prev + 1);
  };

  const handleCashUpdated = () => {
    // 잔고 변경 시에도 포트폴리오(총 자산 등)를 새로고침하도록 유도
    setRefreshKey((prev) => prev + 1);
  };

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
            포트폴리오 요약 및 잔고 관리
           ======================================================= */}
        <section className="dashboard-section portfolio-section">
          <div className="section-header">
            <div>
              <h2>포트폴리오</h2>
              <p>보유 자산과 수익률을 확인하세요.</p>
            </div>
          </div>

          {/* 자산(잔고) 입력 및 관리 컴포넌트 추가 */}
          <AccountManager userId={1} onCashUpdated={handleCashUpdated} />

          <div className="portfolio-card">
            {/* refreshKey를 props로 전달하여 매수/잔고 변경 시 즉시 갱신 */}
            <Portfolio key={refreshKey} />
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
              onOrderComplete={handleOrderComplete}
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
