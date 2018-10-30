package com.example.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.DefaultManagedTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * 配置了一个简单的消息代理，如果不重载，默认情况下回自动配置一个简单的内存消息代理，用来处理以"/topic"为前缀的消息。这里重载configureMessageBroker()方法，
     * 消息代理将会处理前缀为"/topic"和"/queue"的消息。
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 这句话表示在topic和user这两个域上可以向客户端发消息。
        config.enableSimpleBroker("/topic", "/user")
                .setHeartbeatValue(new long[]{10000L, 10000L})
                .setTaskScheduler(new DefaultManagedTaskScheduler());
        // 这句话表示客户单向服务器端发送时的主题上面需要加"/app"作为前缀。
        config.setApplicationDestinationPrefixes("/app");
        // 这句话表示给指定用户发送一对一的主题前缀是"/user"。
        config.setUserDestinationPrefix("/user");
    }

    /**
     * 将"/gs-guide-websocket"路径注册为STOMP端点，这个路径与发送和接收消息的目的路径有所不同，这是一个端点，客户端在订阅或发布消息到目的地址前，要连接该端点，
     * 即用户发送请求url="/gs-guide-websocket"与STOMP server进行连接。之后再转发到订阅url；
     * PS：端点的作用——客户端在订阅或发布消息到目的地址前，要连接该端点。
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        /*
         * 在网页上可以通过"/gs-guide-websocket"来和服务器的WebSocket连接
         *这个和客户端创建连接时的url有关，其中setAllowedOrigins()方法表示允许连接的域名，withSockJS()方法表示支持以SockJS方式连接服务器。
         */
        registry.addEndpoint("/gs-guide-websocket").addInterceptors(new HttpHandshakeInterceptor()).setAllowedOrigins("*");
    }

}