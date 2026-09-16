package com.example.dashboard.service;

import com.example.dashboard.dto.PortfolioResponseDto;
import com.example.dashboard.mapper.PortfolioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioMapper portfolioMapper;

    // 사용자 ID별 보유 자산 목록 조회
    @Transactional(readOnly = true)
    public List<PortfolioResponseDto> getPortfolioByUserId(Long userId) {
        // 1. DB에서 사용자 보유 자산 목록 조회 (Mapper에 해당 메서드가 구현되어 있어야 합니다)
        List<PortfolioResponseDto> portfolioList = portfolioMapper.selectPortfolioByUserId(userId);

        // 2. 필요한 경우 외부 API나 시세 정보를 조회하여 currentPrice(현재가)를 갱신할 수 있습니다.
        // 예시로 각 항목의 현재가를 세팅하는 로직을 추가할 수 있습니다.
        for (PortfolioResponseDto item : portfolioList) {
            // TODO: 실제 시세 연동 로직이 있다면 여기서 currentPrice를 최신화하세요.
            // 예: item.setCurrentPrice(marketPriceService.getCurrentPrice(item.getSymbol()));
        }

        return portfolioList;
    }
}