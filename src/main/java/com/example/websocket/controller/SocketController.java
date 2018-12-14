package com.example.websocket.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
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
        msg = JSONObject.parseObject(msg).getString("msg");
        log.info("客户端发来消息：" + msg);
        // TODO: 处理收到的消息
    }


    /**
     * 测试对指定用户发送消息方法
     * 浏览器  访问https://xcx.dcssn.com/sendToUser?user=123456 前端小程序会收到信息
     * 客户端接收一对一消息的主题应该是“/user/” + 用户Id + “/message” ,这里的用户id可以是一个普通的字符串，只要每个用户端都使用自己的id并且服务端知道每个用户的id就行。
     *
     * @return 发送的消息内容
     */
    @RequestMapping(path = "/sendToUser", method = RequestMethod.GET)
    public String sendToUser(String user) {
        String payload = "指定用户" + user + "接收信息" + LocalTime.now();
        simpMessageSendingOperations.convertAndSendToUser(user, "/message", payload);
        return payload;
    }

    /**
     * 群发消息 订阅/topic/greetings 会收到
     * 浏览器  访问https://xcx.dcssn.com/sendToAll 前端小程序会收到信息
     *
     * @return 发送的消息内容
     */
    @RequestMapping(path = "/sendToAll", method = RequestMethod.GET)
    public String sendToUser() {
        String payload = "群发消息" + LocalTime.now();
        simpMessageSendingOperations.convertAndSend("/topic/greetings", payload);
        return payload;
    }
}