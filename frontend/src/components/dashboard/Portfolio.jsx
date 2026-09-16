import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance"; // axios 대신 axiosInstance 임포트
import "../../styles/Portfolio.css"; // 경로가 다르면 맞게 수정하세요

const Portfolio = () => {
  const [portfolioList, setPortfolioList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 임시 사용자 ID (로그인 구현체에 맞춰 변경하세요)
  const userId = 1;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        // baseURL이 /api로 되어 있으므로 /portfolio만 적어줍니다.
        const response = await axiosInstance.get(`/portfolio?userId=${userId}`);
        setPortfolioList(response.data);
      } catch (error) {
        console.error(
          "포트폴리오 데이터를 불러오는 중 오류가 발생했습니다:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const formatNumber = (value) => {
    return new Intl.NumberFormat("ko-KR").format(
      Math.round(Number(value) || 0),
    );
  };

  const formatPrice = (value) => {
    return `${formatNumber(value)}원`;
  };

  if (loading) {
    return <div className="portfolio-loading">포트폴리오 불러오는 중...</div>;
  }

  if (portfolioList.length === 0) {
    return (
      <div className="portfolio-empty">
        <p>보유 중인 자산이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>종목명</th>
            <th>보유수량</th>
            <th>평균단가</th>
            <th>현재가</th>
            <th>평가금액</th>
            <th>평가손익</th>
            <th>수익률</th>
          </tr>
        </thead>
        <tbody>
          {portfolioList.map((item, index) => {
            console.log("현재 item 데이터:", item); // 이 부분을 추가하세요!
            console.log("현재 item.name:", item.name); // 이 부분도 추가하세요!

            // 수익률 및 손익 계산 (백엔드에서 계산해서 내려준다면 item 필드 바로 사용 가능)
            const buyAmount = item.quantity * item.averagePrice; // 총 매입금액
            const evalAmount = item.quantity * item.currentPrice; // 평가금액
            const profitLoss = evalAmount - buyAmount; // 평가손익
            const profitRate =
              buyAmount > 0 ? (profitLoss / buyAmount) * 100 : 0; // 수익률 (%)

            const isProfit = profitLoss >= 0;

            return (
              <tr key={index}>
                <td className="history-number">{item.name}</td>
                <td className="history-number">{item.quantity}</td>
                <td className="history-number">
                  {formatPrice(item.averagePrice)}
                </td>
                <td className="history-number">
                  {formatPrice(item.currentPrice)}
                </td>
                <td className="history-number">{formatPrice(evalAmount)}</td>
                <td
                  className={`history-number ${isProfit ? "profit" : "loss"}`}
                >
                  {isProfit
                    ? `+${formatPrice(profitLoss)}`
                    : formatPrice(profitLoss)}
                </td>
                <td
                  className={`history-number ${isProfit ? "profit" : "loss"}`}
                >
                  {isProfit
                    ? `+${profitRate.toFixed(2)}%`
                    : `${profitRate.toFixed(2)}%`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
