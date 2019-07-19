package com.example.websocket.config;

/**
 * @author lihy
 * @version 2019/1/21
 */

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.*;

/**
 * 订阅监听
 */
@Component
public class SubscribeEventListener implements ApplicationListener
{

    @Override
    public void onApplicationEvent(ApplicationEvent event)
    {
        // 连接请求
        if (event instanceof SessionConnectEvent)
        {
            SessionConnectEvent sessionConnectEvent = (SessionConnectEvent) event;
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(sessionConnectEvent.getMessage());
            System.out.println(headerAccessor);
            throw new RuntimeException();
        }
        // 连接成功
        else if (event instanceof SessionConnectedEvent)
        {
            SessionConnectedEvent connectedEvent = (SessionConnectedEvent) event;
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(connectedEvent.getMessage());
            System.out.println(headerAccessor);
        }
        // 订阅
        else if (event instanceof SessionSubscribeEvent)
        {
            SessionSubscribeEvent sessionSubscribeEvent = (SessionSubscribeEvent) event;
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(sessionSubscribeEvent.getMessage());
            System.out.println(headerAccessor);
        }
        // 取消订阅
        else if (event instanceof SessionUnsubscribeEvent)
        {
            SessionUnsubscribeEvent unsubscribeEvent = (SessionUnsubscribeEvent) event;
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(unsubscribeEvent.getMessage());
            System.out.println(headerAccessor);
        }
        // 断开连接
        else if (event instanceof SessionDisconnectEvent)
        {
            SessionDisconnectEvent sessionDisconnectEvent = (SessionDisconnectEvent) event;
            StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(sessionDisconnectEvent.getMessage());
        }


    }

}