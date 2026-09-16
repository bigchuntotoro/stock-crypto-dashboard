import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function OrderForm({ symbol, currentPrice, name, stockName }) {
  const [quantity, setQuantity] = useState("");
  const [orderType, setOrderType] = useState("BUY");
  const [price, setPrice] = useState(currentPrice ?? "");

  // 심볼이 바뀌거나(다른 종목 선택) 처음 currentPrice가 들어올 때만
  // 입력창을 현재가로 채워줍니다. 이후 시세가 계속 갱신돼도
  // 사용자가 입력 중인 가격을 강제로 덮어쓰지 않습니다.
  useEffect(() => {
    setPrice(currentPrice ?? "");
  }, [symbol]);

  const safePrice = Number(price) || 0;
  const totalAmount = (Number(quantity) || 0) * safePrice;

  const handleUseMarketPrice = () => {
    setPrice(currentPrice ?? "");
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) return alert("수량을 정확히 입력해주세요.");
    if (!price || price <= 0) return alert("주문 단가를 정확히 입력해주세요.");

    // 전달받은 이름 우선순위 처리 (name -> stockName 순서로 확인, 없으면 symbol 사용)
    const resolvedName = name || stockName || symbol;

    try {
      const payload = {
        userId: 1,
        symbol: symbol,
        name: resolvedName, // 명확한 종목명("TIGER 미국S&P500" 등)이 담김
        type: orderType,
        quantity: parseInt(quantity, 10),
        price: safePrice,
      };

      await axiosInstance.post("/orders", payload);
      alert(`${orderType === "BUY" ? "매수" : "매도"} 주문이 체결되었습니다!`);
      setQuantity("");
    } catch (error) {
      console.error("Order failed:", error);
      alert("주문에 실패했습니다.");
    }
  };

  const displayName = name || stockName || symbol;

  return (
    <form onSubmit={handleOrder} className="order-form-container">
      <div className="order-form-top">
        <h3 className="order-form-title">
          주문창 {displayName && `(${displayName})`}
        </h3>

        <div className="order-type-buttons">
          <button
            type="button"
            onClick={() => setOrderType("BUY")}
            className={`type-btn buy ${orderType === "BUY" ? "active" : ""}`}
          >
            매수
          </button>
          <button
            type="button"
            onClick={() => setOrderType("SELL")}
            className={`type-btn sell ${orderType === "SELL" ? "active" : ""}`}
          >
            매도
          </button>
        </div>

        <div className="form-group">
          <div className="form-group-label-row">
            <label>주문 단가</label>
            <button
              type="button"
              className="use-market-price-btn"
              onClick={handleUseMarketPrice}
            >
              현재가 적용
            </button>
          </div>
          <input
            type="number"
            placeholder="주문 단가를 입력하세요"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>주문 수량</label>
          <input
            type="number"
            placeholder="수량을 입력하세요"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="order-form-bottom">
        <div className="total-amount-box">
          <span>총 주문 금액</span>
          <strong>{totalAmount.toLocaleString()} ₩</strong>
        </div>
        <button
          type="submit"
          className={`submit-btn ${orderType === "BUY" ? "buy-submit" : "sell-submit"}`}
        >
          {orderType === "BUY" ? "매수하기" : "매도하기"}
        </button>
      </div>
    </form>
  );
}
