package com.example.websocket.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author lihy
 * @version 2018/6/8
 */
@Controller
public class IndexController {

    @GetMapping(value = {"/","/2"})
    public String index() {
        return "index";
    }
}
