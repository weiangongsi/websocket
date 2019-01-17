package com.example.websocket;

import com.example.websocket.config.WebSocketConfig;
import org.springframework.util.ClassUtils;

/**
 * @author lihy
 * @version 2018/12/27
 */
public class Main {


    public static void main(String[] args) {
        ClassLoader ccl = Thread.currentThread().getContextClassLoader();
        ClassLoader classLoader = Thread.currentThread().getClass().getClassLoader();
        System.out.println();
        String beanName = ClassUtils.getShortNameAsProperty(WebSocketConfig.class);
        System.out.println(beanName);
    }



}
