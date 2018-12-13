package com.example.websocket.controller;

import com.example.websocket.model.Greeting;
import com.example.websocket.model.HelloMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {

    @Autowired
    SimpMessageSendingOperations simpMessageSendingOperations;

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        // simulated delay
//        simpMessageSendingOperations.convertAndSend("/topic/greetings", new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!"));
        Thread.sleep(1000);
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

    /**
     * 这里用的是@SendToUser，这就是发送给单一客户端的标志。本例中，
     * 客户端接收一对一消息的主题应该是“/user/” + 用户Id + “/message” ,这里的用户id可以是一个普通的字符串，只要每个用户端都使用自己的id并且服务端知道每个用户的id就行。
     *
     * @return
     */
    @MessageMapping("/message")
    @SendToUser("/message")
    public Greeting handleSubscribe() {
        System.out.println("this is the @SubscribeMapping('/marco')");
        return new Greeting("I am a msg from SubscribeMapping('/macro').");
    }

    @MessageMapping("/helloServer")
    public void helloServer(String msg) {
        System.out.println(msg);
    }

    /**
     * 测试对指定用户发送消息方法
     *
     * @return
     */
    @RequestMapping(path = "/send", method = RequestMethod.GET)
    public Greeting send() {
        simpMessageSendingOperations.convertAndSendToUser("1", "/message", new Greeting("I am a msg from SubscribeMapping('/macro')."));
        return new Greeting("I am a msg from SubscribeMapping('/macro').");
    }
}