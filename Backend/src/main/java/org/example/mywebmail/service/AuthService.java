package org.example.mywebmail.service;

import org.example.mywebmail.dto.AuthResponse;
import org.example.mywebmail.dto.UserDto;
import org.example.mywebmail.security.UserPrincipal;

public interface AuthService {

    AuthResponse login(String email, String password);

    AuthResponse register(String email, String password);

    UserPrincipal requireCurrentUser();

    UserDto getCurrentUser();
}
