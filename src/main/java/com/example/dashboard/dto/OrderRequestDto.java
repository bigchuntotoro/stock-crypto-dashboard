package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    private Long userId;
    private String symbol;      // 종목 코드 (예: AAPL, BTC)
    private String name;        // 종목명 (예: TIGER 미국S&P500)
    private String market;      // 시장 구분 (예: ETF, CRYPTO)
    private String type;        // BUY 또는 SELL
    private int quantity;       // 주문 수량
    private double price;       // 주문 가격
    private String status;      // 주문 상태 (예: '체결' 등) - 추가됨!

    public double getTotalAmount() {
        return this.quantity * this.price;
    }
}