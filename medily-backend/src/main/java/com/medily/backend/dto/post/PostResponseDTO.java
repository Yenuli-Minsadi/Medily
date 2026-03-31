package com.medily.backend.dto.post;

import lombok.Data;

import java.util.List;

@Data
public class PostResponseDTO {
    private Integer id;
    private String title;
    private String content;
    private String authorName;
    private List<String> audience;
    private String createdAt;
}