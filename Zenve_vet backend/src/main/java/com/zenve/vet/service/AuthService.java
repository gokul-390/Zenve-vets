package com.zenve.vet.service;

import com.zenve.vet.config.UserDetailsImpl;
import com.zenve.vet.dto.AuthResponse;
import com.zenve.vet.dto.LoginRequest;
import com.zenve.vet.dto.RegisterRequest;
import com.zenve.vet.dto.UserResponse;
import com.zenve.vet.model.Role;
import com.zenve.vet.model.User;
import com.zenve.vet.model.UserStatus;
import com.zenve.vet.repository.UserRepository;
import com.zenve.vet.util.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if (userDetails.getStatus() == UserStatus.SUSPENDED) {
            throw new LockedException("Account has been suspended. Please contact administrator.");
        }
        if (userDetails.getStatus() == UserStatus.INACTIVE) {
            throw new DisabledException("Account is inactive. Please contact administrator.");
        }

        String token = jwtUtils.generateToken(
                userDetails.getUsername(),
                userDetails.getId(),
                userDetails.getRole().name(),
                userDetails.getStatus().name()
        );

        return new AuthResponse(
                token,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getRole(),
                userDetails.getStatus()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already registered!");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_STAFF;

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                UserStatus.ACTIVE
        );

        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateToken(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getRole().name(),
                savedUser.getStatus().name()
        );

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getStatus()
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new BadCredentialsException("No authenticated user found in session.");
        }

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return UserResponse.fromEntity(user);
    }
}
