package com.alexanderpolozhnov.forklift_directory.service;

import com.alexanderpolozhnov.forklift_directory.dto.request.AuthRequest;
import com.alexanderpolozhnov.forklift_directory.dto.response.AuthResponse;
import com.alexanderpolozhnov.forklift_directory.entity.AppUser;
import com.alexanderpolozhnov.forklift_directory.repository.UserRepository;
import com.alexanderpolozhnov.forklift_directory.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        AppUser user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getFullName());
    }
}
