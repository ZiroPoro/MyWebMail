package org.example.mywebmail.dto;

public record AuthResponse(String token, UserDto user) {
}
