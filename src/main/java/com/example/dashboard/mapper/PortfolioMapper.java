package com.example.dashboard.mapper;

import com.example.dashboard.dto.PortfolioResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PortfolioMapper {
    // 기존 자산/현금 관련 메서드
    void decreaseCash(@Param("userId") Long userId, @Param("amount") double amount);
    void increaseCash(@Param("userId") Long userId, @Param("amount") double amount);
    void upsertAsset(@Param("userId") Long userId, @Param("symbol") String symbol, @Param("quantity") int quantity);
    void decreaseAsset(@Param("userId") Long userId, @Param("symbol") String symbol, @Param("quantity") int quantity);

    // 포트폴리오 화면 조회를 위한 메서드 추가
    List<PortfolioResponseDto> selectPortfolioByUserId(@Param("userId") Long userId);
}