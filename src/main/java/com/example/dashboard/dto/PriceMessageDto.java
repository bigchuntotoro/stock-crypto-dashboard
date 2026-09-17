package com.example.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PriceMessageDto {
    private String symbol;
    private double currentPrice;
    private double changeRate;
    private long volume;
    private String timestamp;
}