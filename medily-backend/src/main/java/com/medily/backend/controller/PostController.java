package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.dto.post.PostCreateRequestDTO;
import com.medily.backend.dto.post.PostResponseDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;

    // Create a new post (Doctor and Patient only)
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponseDTO>> createPost(
            @Valid @RequestBody PostCreateRequestDTO request) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.status(201).body(ApiResponse.success(
                postService.createPost((userId), request), "Post created"));
    }

    // List all posts (Doctor, Patient and Admin)
    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponseDTO>>> getAllPosts() {
        return ResponseEntity.ok(ApiResponse.success(postService.getAllPosts()));
    }

    // Remove a post by id (Doctor, Patient and Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Post deleted"));
    }

    private Integer getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}