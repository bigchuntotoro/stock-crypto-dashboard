package com.example.dashboard.mapper;

import com.example.dashboard.dto.OrderRequestDto;
import com.example.dashboard.dto.OrderResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    void insertOrder(OrderRequestDto request);

    // DB에 저장된 거래 내역 조회
    List<OrderResponseDto> selectOrderHistory();

    // 특정 주문 정보 단건 조회 (포트폴리오 원복용)
    OrderResponseDto selectOrderById(@Param("id") Long id);
    // 주문 내역 삭제 쿼리 매핑 추가
    void deleteOrder(@Param("id") Long id);
}