package com.example.dashboard.service;

import com.example.dashboard.dto.AccountDto;
import com.example.dashboard.mapper.AccountMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountMapper accountMapper;

    @Transactional(readOnly = true)
    public AccountDto getAccount(Long userId) {
        return accountMapper.selectAccountByUserId(userId);
    }

    @Transactional
    public void updateCash(Long userId, BigDecimal cash) {
        accountMapper.updateCash(userId, cash);
    }
}