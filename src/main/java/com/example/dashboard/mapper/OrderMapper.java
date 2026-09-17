package com.example.dashboard.mapper;

import com.example.dashboard.dto.OrderRequestDto;
import com.example.dashboard.dto.OrderResponseDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface OrderMapper {
    void insertOrder(OrderRequestDto request);

    // DB에 저장된 거래 내역 조회
    List<OrderResponseDto> selectOrderHistory();
}