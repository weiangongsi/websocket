package com.example.websocket.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

import static java.util.logging.Logger.getLogger;

/**
 * websocket Controller
 *
 * @author lhy
 */
@RestController
public class SocketController {

    private static final Logger log = getLogger(SocketController.class.getName());

    @Autowired
    SimpMessageSendingOperations simpMessageSendingOperations;

    /**
     * 接收客户端发来的消息
     */
    @MessageMapping("/message")
    public void handleSubscribe(String msg) {
        log.info("客户端发来消息：" + msg);
        JSONObject json = JSONObject.parseObject(msg);
        String to = json.getString("to");
        if (!StringUtils.isEmpty(to)) {
            simpMessageSendingOperations.convertAndSendToUser(to, "/message", msg);
        }
    }

    /**
     * 客户端发送群聊消息
     */
    @MessageMapping("/chat-group/{roomId}")
    public void handleGroupMsg(@DestinationVariable String roomId, String msg) {
        log.info("客户端发来消息：" + msg);
        simpMessageSendingOperations.convertAndSend("/topic/chat-group/" + roomId, msg);
    }
}