package com.example.dashboard.service;

import com.example.dashboard.dto.OrderRequestDto;
import com.example.dashboard.dto.OrderResponseDto;
import com.example.dashboard.mapper.OrderMapper;
import com.example.dashboard.mapper.PortfolioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    // 주문 내역 삭제 및 포트폴리오 원복
    @Transactional
    public void deleteOrder(Long id) {
        // 1. 삭제할 주문 정보 조회
        OrderResponseDto order = orderMapper.selectOrderById(id);
        if (order == null) {
            throw new IllegalArgumentException("존재하지 않는 주문 내역입니다.");
        }

        // 2. 총 거래 금액 계산 (BigDecimal 수량 * Long 가격)
        BigDecimal priceDecimal = BigDecimal.valueOf(order.getPrice());
        BigDecimal totalAmountDecimal = order.getQuantity().multiply(priceDecimal);
        double totalAmount = totalAmountDecimal.doubleValue(); // 현금 연산용 double 변환 (또는 BigDecimal 그대로 사용)

        Long userId = order.getUserId();

        // 3. 포트폴리오 반영 내역 역산 (원복)
        if ("BUY".equals(order.getType())) {
            portfolioMapper.increaseCash(userId, totalAmount);
            // quantity가 BigDecimal이므로 int로 변환이 필요할 수 있습니다 (예: order.getQuantity().intValue())
            portfolioMapper.decreaseAsset(userId, order.getSymbol(), order.getQuantity().intValue());
        } else if ("SELL".equals(order.getType())) {
            portfolioMapper.decreaseCash(userId, totalAmount);
            portfolioMapper.upsertAsset(userId, order.getSymbol(), order.getQuantity().intValue());
        }

        // 4. 주문 내역 삭제
        orderMapper.deleteOrder(id);
    }
}