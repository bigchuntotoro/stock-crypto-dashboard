import { useState, useEffect, useCallback, useMemo } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocketData(symbol) {
  const [marketData, setMarketData] = useState(null);

  // 메시지 수신 핸들러 최적화
  const handleMessage = useCallback((message) => {
    try {
      const data = JSON.parse(message.body);
      setMarketData(data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }, []);

  useEffect(() => {
    const socket = new SockJS('/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe(`/topic/market/${symbol}`, handleMessage);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [symbol, handleMessage]);

  // 메모이제이션을 통해 불필요한 객체 생성을 차단하여 렌더링 최적화
  return useMemo(() => ({
    marketData,
  }), [marketData]);
}