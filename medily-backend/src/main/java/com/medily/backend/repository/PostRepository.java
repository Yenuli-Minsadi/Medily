package com.medily.backend.repository;

import com.medily.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByAuthorUserId(Integer userId);
    List<Post> findAllByOrderByCreatedAtDesc();
}