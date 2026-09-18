package com.example.dashboard.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class AccountDto {
    private Long userId;
    private String username;
    private BigDecimal cash;
}