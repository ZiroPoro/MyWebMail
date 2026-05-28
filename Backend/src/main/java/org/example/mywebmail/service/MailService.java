package org.example.mywebmail.service;

import org.example.mywebmail.dto.MailMessageDto;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MailService {

    private final List<MailMessageDto> inbox = new ArrayList<>();

    public MailService() {
        inbox.add(new MailMessageDto(
                nextId(),
                "dean@university.edu",
                "Расписание зачётов",
                "Коллеги, актуальное расписание опубликовано на портале.",
                Instant.now().minusSeconds(7200).toString()
        ));
        inbox.add(new MailMessageDto(
                nextId(),
                "security@lab.local",
                "Лабораторная: Git forensics",
                "Изучите расхождение author date и committer date в reflog.",
                Instant.now().minusSeconds(3600).toString()
        ));
        inbox.add(new MailMessageDto(
                nextId(),
                "team@mywebmail.dev",
                "Добро пожаловать в MyWebMail",
                "Это демо-входящие. Подключите SMTP в следующей версии.",
                Instant.now().toString()
        ));
    }

    public List<MailMessageDto> getInbox() {
        return List.copyOf(inbox);
    }

    private static String nextId() {
        return UUID.randomUUID().toString();
    }
}
