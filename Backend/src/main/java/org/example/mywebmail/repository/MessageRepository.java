package org.example.mywebmail.repository;

import org.example.mywebmail.entity.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {

    @EntityGraph(attributePaths = {"sender", "recipient"})
    @Query("SELECT m FROM MessageEntity m WHERE m.recipient.id = :userId ORDER BY m.sentAt DESC")
    Page<MessageEntity> findInbox(@Param("userId") UUID userId, Pageable pageable);

    @EntityGraph(attributePaths = {"sender", "recipient"})
    @Query("SELECT m FROM MessageEntity m WHERE m.sender.id = :userId ORDER BY m.sentAt DESC")
    Page<MessageEntity> findSent(@Param("userId") UUID userId, Pageable pageable);
}
