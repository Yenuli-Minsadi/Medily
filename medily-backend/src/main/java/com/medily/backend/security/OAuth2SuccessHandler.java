package com.medily.backend.security;

import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name  = oAuth2User.getAttribute("name");

        // Find existing user or create a new one
        boolean[] isNew = { false };
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            isNew[0] = true;
            User newUser = new User();
            return userRepository.save(newUser);
        });

        // Check if the account is deactivated
        if (user.getStatus() == User.Status.INACTIVE) {
            String errorMessage = URLEncoder.encode("Your account has been deactivated. Please contact support.", StandardCharsets.UTF_8);
            response.sendRedirect("http://localhost:5173/login?error=" + errorMessage);
            return; // Stop the process here so no token is generated
        }

        // Generate JWT and redirect only if ACTIVE
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash() != null ? user.getPasswordHash() : "",
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                );

        String token = jwtService.generateToken(userDetails);

        // Build redirect URL with all needed params
        String redirectUrl = "http://localhost:5173/oauth2/callback"
            + "?token=" + token
            + "&role=" + user.getRole().name()
            + "&name=" + URLEncoder.encode(user.getFullName(), StandardCharsets.UTF_8)
            + "&userId=" + user.getUserId()
            + "&accountStatus=" + user.getAccountStatus().name()
            + "&isSubscribed=" + user.getIsSubscribed()
            + "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
            + "&newUser=" + isNew[0];

        response.sendRedirect(redirectUrl);
    }
}