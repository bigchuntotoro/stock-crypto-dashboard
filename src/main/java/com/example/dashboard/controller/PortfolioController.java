package com.example.dashboard.controller;

import com.example.dashboard.dto.PortfolioResponseDto;
import com.example.dashboard.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    // 사용자별 보유 자산 및 수익률 목록 조회
    @GetMapping
    public ResponseEntity<List<PortfolioResponseDto>> getPortfolio(@RequestParam Long userId) {
        List<PortfolioResponseDto> portfolio = portfolioService.getPortfolioByUserId(userId);
        return ResponseEntity.ok(portfolio);
    }
}