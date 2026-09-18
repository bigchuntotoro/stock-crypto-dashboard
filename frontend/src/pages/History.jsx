import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import "../styles/History.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // 백엔드 API로부터 DB 거래 내역 불러오기
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders/history");
      setHistory(response.data);
    } catch (error) {
      console.error("거래 내역을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ============================================================
  // 삭제 핸들러 추가
  // ============================================================
  const handleDelete = async (id) => {
    if (!window.confirm("해당 거래내역을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await axios.delete(`/api/orders/${id}`);
      // 삭제 성공 시 상태(state)를 갱신하여 화면에서 즉시 제거
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("거래내역 삭제 중 오류가 발생했습니다:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // 필터링
  const filteredHistory = useMemo(() => {
    if (filter === "ALL") return history;
    if (filter === "BUY") return history.filter((item) => item.type === "BUY");
    if (filter === "SELL")
      return history.filter((item) => item.type === "SELL");
    if (filter === "ETF")
      return history.filter((item) => item.market === "ETF");
    if (filter === "CRYPTO")
      return history.filter((item) => item.market === "CRYPTO");
    return history;
  }, [history, filter]);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("ko-KR").format(
      Math.round(Number(value) || 0),
    );
  };

  const formatPrice = (value) => {
    return `${formatNumber(value)}원`;
  };

  const getTypeClass = (type) =>
    type === "BUY" ? "buy" : type === "SELL" ? "sell" : "";
  const getTypeText = (type) =>
    type === "BUY" ? "매수" : type === "SELL" ? "매도" : type;

  return (
    <>
      <Header />

      <div className="history-page">
        <section className="history-page-header">
          <div>
            <h1 className="history-page-title">거래내역</h1>
            <p className="history-page-subtitle">
              주식과 암호화폐의 거래 내역을 확인하세요.
            </p>
          </div>
          <div className="history-count">총 {filteredHistory.length}건</div>
        </section>

        <section className="history-table-card">
          <div className="history-table-wrapper">
            {loading ? (
              <div className="history-empty">
                <h3>데이터를 불러오는 중입니다...</h3>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="history-empty">
                <div className="history-empty-icon">📋</div>
                <h3>거래내역이 없습니다.</h3>
                <p>DB에 저장된 조건에 맞는 거래내역이 없습니다.</p>
              </div>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>거래일시</th>
                    <th>구분</th>
                    <th>시장</th>
                    <th>종목</th>
                    <th>수량</th>
                    <th>체결가격</th>
                    <th>거래금액</th>
                    <th>상태</th>
                    <th>관리</th> {/* 관리 헤더 추가 */}
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="history-date">{item.date}</td>
                      <td>
                        <span
                          className={`history-type ${getTypeClass(item.type)}`}
                        >
                          {getTypeText(item.type)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`history-market ${item.market === "CRYPTO" ? "crypto" : "etf"}`}
                        >
                          {item.market}
                        </span>
                      </td>
                      <td>
                        <div className="history-symbol-info">
                          <strong>{item.name}</strong>
                        </div>
                      </td>
                      <td className="history-number">{item.quantity}</td>
                      <td className="history-number">
                        {formatPrice(item.price)}
                      </td>
                      <td className="history-amount">
                        {formatPrice(item.amount)}
                      </td>
                      <td>
                        <span className="history-status">
                          {item.status || "체결"}
                        </span>
                      </td>
                      <td>
                        {/* 삭제 버튼 추가 */}
                        <button
                          className="history-delete-btn"
                          onClick={() => handleDelete(item.id)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#ff4d4f",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default History;
