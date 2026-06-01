package org.example.mywebmail.controller;

import jakarta.validation.Valid;
import org.example.mywebmail.dto.MailMessageDto;
import org.example.mywebmail.dto.PageResponse;
import org.example.mywebmail.dto.SendMailRequest;
import org.example.mywebmail.service.AuthService;
import org.example.mywebmail.service.MailService;
import org.example.mywebmail.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    private final MailService mailService;
    private final AuthService authService;
    private final UserService userService;

    public MailController(MailService mailService, AuthService authService, UserService userService) {
        this.mailService = mailService;
        this.authService = authService;
        this.userService = userService;
    }

    @GetMapping("/inbox")
    public ResponseEntity<PageResponse<MailMessageDto>> inbox(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var user = authService.requireCurrentUser();
        return ResponseEntity.ok(mailService.getInbox(user, page, size));
    }

    @GetMapping("/sent")
    public ResponseEntity<PageResponse<MailMessageDto>> sent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var user = authService.requireCurrentUser();
        return ResponseEntity.ok(mailService.getSent(user, page, size));
    }

    @PostMapping("/send")
    public ResponseEntity<MailMessageDto> send(@Valid @RequestBody SendMailRequest request) {
        var user = authService.requireCurrentUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(mailService.send(user, request));
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<String>> addresses() {
        return ResponseEntity.ok(userService.findAllEmails());
    }
}
