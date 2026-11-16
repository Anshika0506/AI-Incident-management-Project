package com.incident.incident_management.controller;

import com.incident.incident_management.dto.JwtResponse;
import com.incident.incident_management.dto.LoginRequest;
import com.incident.incident_management.dto.RegisterRequest;
import com.incident.incident_management.model.Role;
import com.incident.incident_management.model.User;
import com.incident.incident_management.repository.UserRepository;
import com.incident.incident_management.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // 1. User Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Password Hashing
        user.setRole(Role.ROLE_USER);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // 2. User Login Endpoint (Generates JWT)
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Invalid username or password!");
        }

        // Generate JWT Token
        String token = jwtUtils.generateToken(user.getUsername());

        return ResponseEntity.ok(new JwtResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        ));
    }
}
