package com.example.dashboard.service;

import com.example.dashboard.dto.OrderRequestDto;
import com.example.dashboard.dto.OrderResponseDto;
import com.example.dashboard.mapper.OrderMapper;
import com.example.dashboard.mapper.PortfolioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final PortfolioMapper portfolioMapper;

    // 주문 생성 및 처리 (컨트롤러에서 호출하는 이름과 일치시킴)
    @Transactional
    public void createOrder(OrderRequestDto request) {
        // 1. 주문 유효성 검증 (예: 잔고 확인, 수량 확인 등)
        if (request.getQuantity() <= 0 || request.getPrice() <= 0) {
            throw new IllegalArgumentException("주문 수량과 가격은 0보다 커야 합니다.");
        }

        // 2. 주문 내역 저장
        orderMapper.insertOrder(request);

        // 3. 보유 자산(포트폴리오) 업데이트 (매수/매도에 따른 수량 및 현금 계산)
        if ("BUY".equals(request.getType())) {
            portfolioMapper.decreaseCash(request.getUserId(), request.getTotalAmount());
            portfolioMapper.upsertAsset(request.getUserId(), request.getSymbol(), request.getQuantity());
        } else if ("SELL".equals(request.getType())) {
            portfolioMapper.increaseCash(request.getUserId(), request.getTotalAmount());
            portfolioMapper.decreaseAsset(request.getUserId(), request.getSymbol(), request.getQuantity());
        }
    }

    // 저장된 거래 내역 조회 메서드
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrderHistory() {
        return orderMapper.selectOrderHistory();
    }

    // 주문 내역 삭제 메서드 추가
    @Transactional
    public void deleteOrder(Long id) {
        orderMapper.deleteOrder(id);
    }
}