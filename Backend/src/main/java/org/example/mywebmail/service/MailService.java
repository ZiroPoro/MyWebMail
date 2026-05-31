package org.example.mywebmail.service;

import org.example.mywebmail.dto.MailMessageDto;
import org.example.mywebmail.dto.PageResponse;
import org.example.mywebmail.dto.SendMailRequest;
import org.example.mywebmail.security.UserPrincipal;

public interface MailService {

    PageResponse<MailMessageDto> getInbox(UserPrincipal user, int page, int size);

    PageResponse<MailMessageDto> getSent(UserPrincipal user, int page, int size);

    MailMessageDto send(UserPrincipal sender, SendMailRequest request);
}
