package com.example.websocket.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

import static java.util.logging.Logger.getLogger;

@RestController
public class SocketGroupController {

    private static final Logger log = getLogger(SocketController.class.getName());

    @Autowired
    SimpMessageSendingOperations simpMessageSendingOperations;


    /**
     * 客户端发送群聊消息
     */
    @MessageMapping("/group/{roomId}")
    public void handleGroupMsg(@DestinationVariable String roomId, String msg) {
        log.info("客户端发来消息：" + msg);
        simpMessageSendingOperations.convertAndSend("/topic/chat/" + roomId, msg);
    }

}
