package ru.locate.garbage.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.locate.garbage.server.model.Image;

@RestController
public class ImageUploadController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        // Логика обработки загруженного файла
        if (!file.isEmpty()) {
            Image image = new Image();
            image.setName(file.getOriginalFilename());
            return ResponseEntity.ok("File uploaded successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to upload file.");
        }
    }
}