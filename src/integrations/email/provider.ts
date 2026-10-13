export interface EmailMessage {
  to: string
  subject: string
  text: string
  replyTo?: string
  idempotencyKey: string
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>
}
