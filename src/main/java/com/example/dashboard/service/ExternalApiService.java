package com.example.dashboard.service;

import com.example.dashboard.dto.PriceMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExternalApiService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 외부 공공/오픈 API 또는 소켓에서 시세 데이터를 수신했을 때 호출되는 메서드
     */
    public void broadcastMarketPrice(String symbol, double price, double changeRate, long volume) {
        PriceMessageDto priceDto = new PriceMessageDto(
                symbol,
                price,
                changeRate,
                volume,
                String.valueOf(System.currentTimeMillis())
        );

        // /topic/market/{symbol}을 구독중인 프론트엔드 클라이언트에게 실시간 푸시
        messagingTemplate.convertAndSend("/topic/market/" + symbol, priceDto);
    }
}