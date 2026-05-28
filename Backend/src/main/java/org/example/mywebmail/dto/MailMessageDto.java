package org.example.mywebmail.dto;

public record MailMessageDto(
        String id,
        String from,
        String subject,
        String preview,
        String receivedAt
) {
}
