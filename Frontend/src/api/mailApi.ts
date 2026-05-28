export interface MailMessage {
  id: string;
  from: string;
  subject: string;
  preview: string;
  receivedAt: string;
}

export async function fetchInbox(): Promise<MailMessage[]> {
  const response = await fetch('/api/mail/inbox');
  if (!response.ok) {
    throw new Error('inbox request failed');
  }
  return response.json() as Promise<MailMessage[]>;
}
