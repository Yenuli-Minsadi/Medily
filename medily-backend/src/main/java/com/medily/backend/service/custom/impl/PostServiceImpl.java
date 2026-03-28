package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.post.PostCreateRequestDTO;
import com.medily.backend.dto.post.PostResponseDTO;
import com.medily.backend.entity.Post;
import com.medily.backend.entity.User;
import com.medily.backend.repository.PostRepository;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public PostResponseDTO createPost(Long doctorUserId, PostCreateRequestDTO request) {
        User user = userRepository.findById(doctorUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setAuthor(user);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());

        return mapToResponse(postRepository.save(post));
    }

    @Override
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public void deletePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        postRepository.deleteById(postId);
    }

    private PostResponseDTO mapToResponse(Post p) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(Long.valueOf(p.getPostId()));
        dto.setTitle(p.getTitle());
        dto.setContent(p.getContent());
        dto.setAuthorName(p.getAuthor().getFullName());
        return dto;
    }
}