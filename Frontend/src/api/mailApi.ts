import { apiFetch, readError } from './http';

export interface MailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function fetchInbox(page = 0, size = 20): Promise<PageResponse<MailMessage>> {
  const response = await apiFetch(`/api/mail/inbox?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<PageResponse<MailMessage>>;
}

export async function fetchSent(page = 0, size = 20): Promise<PageResponse<MailMessage>> {
  const response = await apiFetch(`/api/mail/sent?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<PageResponse<MailMessage>>;
}

export async function sendMail(toEmail: string, subject: string, body: string): Promise<MailMessage> {
  const response = await apiFetch('/api/mail/send', {
    method: 'POST',
    body: JSON.stringify({ toEmail, subject, body }),
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<MailMessage>;
}

export async function fetchAddresses(): Promise<string[]> {
  const response = await apiFetch('/api/mail/addresses');
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<string[]>;
}
