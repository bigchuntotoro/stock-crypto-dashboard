package com.example.dashboard.controller;

import com.example.dashboard.dto.AccountDto;
import com.example.dashboard.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // 현재 잔고 조회
    @GetMapping("/{userId}")
    public ResponseEntity<AccountDto> getAccount(@PathVariable("userId") Long userId) {
        AccountDto account = accountService.getAccount(userId);
        return ResponseEntity.ok(account);
    }

    // 잔고 입력 및 수정
    @PutMapping("/{userId}/cash")
    public ResponseEntity<Void> updateCash(
            @PathVariable("userId") Long userId,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal cash = request.get("cash");
        accountService.updateCash(userId, cash);
        return ResponseEntity.ok().build();
    }
}