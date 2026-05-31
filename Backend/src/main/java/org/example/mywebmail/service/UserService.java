package org.example.mywebmail.service;

import org.example.mywebmail.dto.UserDto;

import java.util.List;
import java.util.UUID;

public interface UserService {

    UserDto register(String email, String password);

    List<UserDto> findAll();

    List<String> findAllEmails();

    void delete(UUID targetId, UUID requestedBy);
}
