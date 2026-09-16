package com.example.dashboard.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PortfolioResponseDto {
    private String symbol;       // 종목 코드 (예: 360750)
    private String name;         // 종목명 (예: TIGER 미국S&P500)
    private int quantity;        // 보유 수량
    private BigDecimal averagePrice; // 평균 매입가
    private BigDecimal currentPrice; // 현재가
}