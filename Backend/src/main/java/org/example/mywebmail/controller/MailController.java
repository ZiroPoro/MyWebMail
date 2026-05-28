package org.example.mywebmail.controller;

import org.example.mywebmail.dto.MailMessageDto;
import org.example.mywebmail.service.MailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @GetMapping("/inbox")
    public List<MailMessageDto> inbox() {
        return mailService.getInbox();
    }
}
