package org.example.mywebmail.service;

import org.example.mywebmail.dto.UserDto;
import org.example.mywebmail.entity.Role;
import org.example.mywebmail.entity.UserEntity;
import org.example.mywebmail.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDto register(String email, String password) {
        if (password == null || password.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Пароль должен быть не короче 6 символов");
        }
        String normalized = normalizeEmail(email);
        if (userRepository.existsByEmailIgnoreCase(normalized)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пользователь с таким email уже существует");
        }
        UserEntity saved = userRepository.save(new UserEntity(
                UUID.randomUUID(),
                normalized,
                passwordEncoder.encode(password),
                Role.USER,
                Instant.now()
        ));
        return UserDto.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(UserDto::from).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> findAllEmails() {
        return userRepository.findAll().stream().map(UserEntity::getEmail).sorted().toList();
    }

    @Override
    @Transactional
    public void delete(UUID targetId, UUID requestedBy) {
        UserEntity target = userRepository.findById(targetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Пользователь не найден"));
        if (target.getId().equals(requestedBy)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Нельзя удалить свою учётную запись");
        }
        if (target.getRole() == Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Нельзя удалить последнего администратора");
        }
        userRepository.delete(target);
    }

    private static String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email обязателен");
        }
        return email.trim().toLowerCase();
    }
}
