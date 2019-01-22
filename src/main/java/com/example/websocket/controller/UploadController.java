package com.example.websocket.controller;

import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;

/**
 * @author lihy
 * @version 2019/1/22
 */
@RestController
public class UploadController {

    @PostMapping("upload")
    public String upload(@RequestParam("file") MultipartFile file) {
        String suffix = getSuffixByFilename(Objects.requireNonNull(file.getOriginalFilename()));
        String filename = System.currentTimeMillis() + suffix;
        File targetFile = new File("/upload/" + filename);
        try {
            FileCopyUtils.copy(file.getInputStream(), new FileOutputStream(targetFile));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "file/" + filename;
    }

    /**
     * 根据给定的文件名,获取其后缀信息
     */
    public static String getSuffixByFilename(String filename) {
        return filename.substring(filename.lastIndexOf(".")).toLowerCase();
    }
}
