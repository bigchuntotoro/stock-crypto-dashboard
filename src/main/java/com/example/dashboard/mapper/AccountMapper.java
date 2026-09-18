package com.example.dashboard.mapper;

import com.example.dashboard.dto.AccountDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;

@Mapper
public interface AccountMapper {
    // 사용자 잔고 조회 (예시로 첫 번째 사용자 혹은 특정 사용자 기준)
    AccountDto selectAccountByUserId(@Param("userId") Long userId);

    // 잔고 입력 및 수정 (초기 설정 또는 업데이트)
    void updateCash(@Param("userId") Long userId, @Param("cash") BigDecimal cash);
}