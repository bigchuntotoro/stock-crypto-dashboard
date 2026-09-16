package com.example.dashboard.controller;

import com.example.dashboard.dto.PortfolioResponseDto;
import com.example.dashboard.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    /**
     * 사용자별 보유 자산 및 네이버 실시간 시세가 반영된 포트폴리오 목록 조회
     * @param userId 사용자 ID
     * @return 실시간 현재가가 갱신된 포트폴리오 DTO 리스트
     */
    @GetMapping
    public ResponseEntity<List<PortfolioResponseDto>> getPortfolio(@RequestParam Long userId) {
        log.info("사용자 ID: {} 의 포트폴리오 및 실시간 시세 조회 요청", userId);

        List<PortfolioResponseDto> portfolio = portfolioService.getPortfolioByUserId(userId);

        return ResponseEntity.ok(portfolio);
    }

    /**
     * 특정 종목의 네이버 금융 크롤링 테스트용 엔드포인트
     * @param symbol 종목 코드 (예: 360750)
     * @return 크롤링된 실시간 현재가 숫자

    @GetMapping("/test-price")
    public ResponseEntity<Long> testPrice(@RequestParam String symbol) {
        log.info("종목 코드: {} 의 네이버 실시간 시세 크롤링 테스트 요청", symbol);

        long livePrice = portfolioService.fetchNaverStockPrice(symbol);

        return ResponseEntity.ok(livePrice);
    }
     */
}