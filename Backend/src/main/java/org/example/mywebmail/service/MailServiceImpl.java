package org.example.mywebmail.service;

import org.example.mywebmail.dto.MailMessageDto;
import org.example.mywebmail.dto.PageResponse;
import org.example.mywebmail.dto.SendMailRequest;
import org.example.mywebmail.entity.MessageEntity;
import org.example.mywebmail.entity.UserEntity;
import org.example.mywebmail.repository.MessageRepository;
import org.example.mywebmail.repository.UserRepository;
import org.example.mywebmail.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
public class MailServiceImpl implements MailService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MailServiceImpl(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MailMessageDto> getInbox(UserPrincipal user, int page, int size) {
        Page<MessageEntity> result = messageRepository.findInbox(
                user.getId(),
                PageRequest.of(page, size)
        );
        return PageResponse.from(result.map(MailMessageDto::from));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MailMessageDto> getSent(UserPrincipal user, int page, int size) {
        Page<MessageEntity> result = messageRepository.findSent(
                user.getId(),
                PageRequest.of(page, size)
        );
        return PageResponse.from(result.map(MailMessageDto::from));
    }

    @Override
    @Transactional
    public MailMessageDto send(UserPrincipal sender, SendMailRequest request) {
        UserEntity from = userRepository.findById(sender.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Пользователь не найден"));
        UserEntity to = userRepository.findByEmailIgnoreCase(request.toEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Получатель не найден"));
        if (from.getId().equals(to.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Нельзя отправить письмо самому себе");
        }
        MessageEntity saved = messageRepository.save(new MessageEntity(
                UUID.randomUUID(),
                from,
                to,
                request.subject().trim(),
                request.body().trim(),
                Instant.now()
        ));
        return MailMessageDto.from(saved);
    }
}
