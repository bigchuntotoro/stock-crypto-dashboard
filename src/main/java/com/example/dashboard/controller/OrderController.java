package com.example.dashboard.controller;

import com.example.dashboard.dto.OrderRequestDto;
import com.example.dashboard.dto.OrderResponseDto;
import com.example.dashboard.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 거래 내역 조회 API
    @GetMapping("/history")
    public ResponseEntity<List<OrderResponseDto>> getOrderHistory() {
        List<OrderResponseDto> history = orderService.getOrderHistory();
        return ResponseEntity.ok(history);
    }

    // 주문 생성 (매수/매도) API
    @PostMapping
    public ResponseEntity<Void> createOrder(@RequestBody OrderRequestDto requestDto) {
        orderService.createOrder(requestDto);
        return ResponseEntity.ok().build();
    }

    // 주문 내역 삭제 API 추가
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
}