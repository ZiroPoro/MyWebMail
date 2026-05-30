package org.example.mywebmail.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMailRequest(
        @NotBlank String toEmail,
        @NotBlank @Size(max = 500) String subject,
        @NotBlank String body
) {
}
