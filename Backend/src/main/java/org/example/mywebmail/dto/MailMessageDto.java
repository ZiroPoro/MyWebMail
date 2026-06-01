package org.example.mywebmail.dto;

import org.example.mywebmail.entity.MessageEntity;

import java.util.UUID;

public record MailMessageDto(
        UUID id,
        String from,
        String to,
        String subject,
        String body,
        String sentAt,
        boolean read
) {
    public static MailMessageDto from(MessageEntity entity) {
        return new MailMessageDto(
                entity.getId(),
                entity.getSender().getEmail(),
                entity.getRecipient().getEmail(),
                entity.getSubject(),
                entity.getBody(),
                entity.getSentAt().toString(),
                entity.getReadAt() != null
        );
    }
}
