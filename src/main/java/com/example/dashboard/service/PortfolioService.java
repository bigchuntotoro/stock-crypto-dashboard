package com.example.dashboard.service;

import com.example.dashboard.dto.PortfolioResponseDto;
import com.example.dashboard.mapper.PortfolioMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioMapper portfolioMapper;

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String NAVER_REALTIME_URL =
            "https://polling.finance.naver.com/api/realtime/domestic/stock/";

    // 종목코드 -> 현재가, 20초 TTL 캐시 (필요하면 10~30초 사이로 조정)
    private static final Cache<String, Long> PRICE_CACHE = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofSeconds(20))
            .maximumSize(1000)
            .build();

    @Transactional(readOnly = true)
    public List<PortfolioResponseDto> getPortfolioByUserId(Long userId) {
        List<PortfolioResponseDto> portfolioList = portfolioMapper.selectPortfolioByUserId(userId);

        if (portfolioList.isEmpty()) {
            return portfolioList;
        }

        List<String> symbols = portfolioList.stream()
                .map(PortfolioResponseDto::getSymbol)
                .distinct()
                .collect(Collectors.toList());

        Map<String, Long> priceMap = getPricesWithCache(symbols);

        for (PortfolioResponseDto item : portfolioList) {
            Long livePrice = priceMap.get(item.getSymbol());
            if (livePrice != null && livePrice > 0) {
                item.setCurrentPrice(BigDecimal.valueOf(livePrice));
            }
        }

        return portfolioList;
    }

    /**
     * 캐시에 있는 종목은 캐시값 사용, 없는 종목만 모아서 네이버 API를 배치 호출
     */
    private Map<String, Long> getPricesWithCache(List<String> symbols) {
        Map<String, Long> result = new HashMap<>();
        List<String> missingSymbols = new ArrayList<>();

        for (String symbol : symbols) {
            Long cached = PRICE_CACHE.getIfPresent(symbol);
            if (cached != null) {
                result.put(symbol, cached);
            } else {
                missingSymbols.add(symbol);
            }
        }

        if (!missingSymbols.isEmpty()) {
            Map<String, Long> fetched = fetchNaverStockPrices(missingSymbols);
            fetched.forEach(PRICE_CACHE::put); // 새로 받아온 값 캐시에 저장
            result.putAll(fetched);
        }

        return result;
    }

    /**
     * 네이버 금융 실시간 시세 API로 여러 종목의 현재가를 한 번에 조회
     */
    public Map<String, Long> fetchNaverStockPrices(List<String> symbols) {
        Map<String, Long> result = new HashMap<>();
        if (symbols == null || symbols.isEmpty()) {
            return result;
        }

        String codes = String.join(",", symbols);
        String url = NAVER_REALTIME_URL + codes;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0")
                    .header("Referer", "https://finance.naver.com/")
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();

            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("네이버 시세 API 응답 코드 이상 (status={}, symbols={})", response.statusCode(), codes);
                return result;
            }

            JsonNode root = OBJECT_MAPPER.readTree(response.body());
            JsonNode datas = root.path("datas");

            if (datas.isArray()) {
                for (JsonNode data : datas) {
                    String itemCode = data.path("itemCode").asText(null);
                    String priceText = data.path("closePrice").asText("").replaceAll("[^0-9]", "");
                    if (itemCode != null && !priceText.isEmpty()) {
                        result.put(itemCode, Long.parseLong(priceText));
                    }
                }
            }

        } catch (Exception e) {
            log.error("네이버 시세 조회 실패 (symbols={}): {}", codes, e.getMessage(), e);
        }

        return result;
    }
}