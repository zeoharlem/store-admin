import type { Email } from '@/features/mail/domain'
import type { MailRepository } from '@/features/mail/domain/repositories/mail-repository'
import { db } from '@/fake-db/apps/mail'

export class InMemoryMailRepository implements MailRepository {
  constructor(private readonly database: Email[] = db) {}

  findAll(): Email[] {
    return [...this.database]
  }
}
