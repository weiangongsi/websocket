package com.example.websocket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * 微信接口
 *
 * @author lihy
 * @version 2019/1/17
 */
@RestController
@RequestMapping("wechat")
public class WeChatController {

    private final RestTemplate restTemplate;
    @Value("${wechat.appid}")
    private String appid;
    @Value("${wechat.secret}")
    private String secret;

    @Autowired
    public WeChatController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("openid")
    public String openid(String code) {
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code="+code+"&grant_type=authorization_code";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}
