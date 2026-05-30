package org.example.mywebmail.dto;

import org.example.mywebmail.entity.Role;
import org.example.mywebmail.entity.UserEntity;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        Role role,
        String registeredAt
) {
    public static UserDto from(UserEntity entity) {
        return new UserDto(
                entity.getId(),
                entity.getEmail(),
                entity.getRole(),
                entity.getRegisteredAt().toString()
        );
    }
}
