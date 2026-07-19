package com.medily.backend.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    // In memory-cache for rate limit buckets with automatic expiration
    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(10))
            .maximumSize(10_000)
            .build();

    private Bucket createNewBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(100,
                        Refill.intervally(100, Duration.ofMinutes(1))))
                .build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip rate limiting for WebSocket and auth endpoints
        if (path.startsWith("/ws") || path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = resolveKey(request);

        Bucket bucket = buckets.get(key, k -> createNewBucket());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.getWriter().write("Rate limit exceeded. Please try again later.");
        }
    }

    // Hybrid key
    private String resolveKey(HttpServletRequest request) {
        // Limit per user who's logged in, else fallback to IP
        if (request.getUserPrincipal() != null) {
            return "USER_" + request.getUserPrincipal().getName();
        }
        return "IP_" + request.getRemoteAddr();
    }
}