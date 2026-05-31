package org.example.mywebmail.service;

import org.example.mywebmail.dto.AuthResponse;
import org.example.mywebmail.dto.UserDto;
import org.example.mywebmail.entity.UserEntity;
import org.example.mywebmail.repository.UserRepository;
import org.example.mywebmail.security.JwtService;
import org.example.mywebmail.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
                           UserService userService,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(String email, String password) {
        UserEntity user = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный email или пароль"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Неверный email или пароль");
        }
        return buildResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse register(String email, String password) {
        UserDto created = userService.register(email, password);
        UserEntity user = userRepository.findById(created.id())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка регистрации"));
        return buildResponse(user);
    }

    @Override
    public UserPrincipal requireCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Требуется авторизация");
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        UserPrincipal principal = requireCurrentUser();
        return userRepository.findById(principal.getId())
                .map(UserDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Пользователь не найден"));
    }

    private AuthResponse buildResponse(UserEntity user) {
        String token = jwtService.createToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, UserDto.from(user));
    }
}
