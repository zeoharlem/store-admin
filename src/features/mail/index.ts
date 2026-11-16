import { InMemoryMailRepository } from '@/features/mail/infrastructure/in-memory-mail-repository'

const mailRepository = new InMemoryMailRepository()

export const getMail = () => mailRepository.findAll()
