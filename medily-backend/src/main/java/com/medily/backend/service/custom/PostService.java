package com.medily.backend.service.custom;

import com.medily.backend.dto.post.PostCreateRequestDTO;
import com.medily.backend.dto.post.PostResponseDTO;

import java.util.List;

public interface PostService {
    PostResponseDTO createPost(Integer doctorUserId, PostCreateRequestDTO request);
    List<PostResponseDTO> getAllPosts();
    void deletePost(Integer postId);
}