import type { Email } from '@/features/mail/domain'

export interface MailRepository {
  findAll(): Email[]
}
