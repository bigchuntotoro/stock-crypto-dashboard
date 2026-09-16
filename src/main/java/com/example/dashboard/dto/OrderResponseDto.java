package com.example.dashboard.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderResponseDto {
    private Long id;
    private String date;       // created_at (매핑)
    private String type;       // BUY / SELL
    private String market;     // ETF / CRYPTO 등
    private String name;       // 종목명
    private String symbol;     // 종목 코드
    private BigDecimal quantity; // 수량
    private Long price;        // 체결 가격
    private Long amount;       // 거래 금액 (quantity * price)
    private String status;     // 상태 (기본 '체결')
}