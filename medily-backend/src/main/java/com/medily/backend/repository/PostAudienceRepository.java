package com.medily.backend.repository;

import com.medily.backend.entity.PostAudience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostAudienceRepository extends JpaRepository<PostAudience, Long> {
    List<PostAudience> findByPostId(Long postId);
}