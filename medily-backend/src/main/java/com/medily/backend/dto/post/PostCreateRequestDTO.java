package com.medily.backend.dto.post;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class PostCreateRequestDTO {
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    private List<String> audience;
}