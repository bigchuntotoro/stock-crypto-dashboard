package com.example.dashboard.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PortfolioResponseDto {
    private String symbol;       // 종목 코드 (예: 360750)
    private String name;         // 종목명 (예: TIGER 미국S&P500)
    private int quantity;        // 보유 수량
    private double averagePrice; // 평균 매입가
    private double currentPrice; // 현재가
}