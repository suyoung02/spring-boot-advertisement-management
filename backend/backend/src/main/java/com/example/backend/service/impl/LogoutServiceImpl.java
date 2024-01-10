package com.example.backend.service.impl;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class LogoutServiceImpl implements LogoutHandler {
    private final UserRepository userRepository;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        jwt = authHeader.substring(7);

        String username =  authentication.getName();
        System.out.println(username);
        User user = userRepository.findByUsername(username).get();
        user.setRefreshToken(null);
        userRepository.save(user);
    }
}
