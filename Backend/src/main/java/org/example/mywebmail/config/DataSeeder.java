package org.example.mywebmail.config;

import org.example.mywebmail.entity.Role;
import org.example.mywebmail.entity.UserEntity;
import org.example.mywebmail.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seed("admin@mywebmail.local", "admin123", Role.ADMIN);
        seed("user@mywebmail.local", "user123", Role.USER);
    }

    private void seed(String email, String password, Role role) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }
        userRepository.save(new UserEntity(
                UUID.randomUUID(),
                email.toLowerCase(),
                passwordEncoder.encode(password),
                role,
                Instant.now()
        ));
    }
}
