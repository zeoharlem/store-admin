import { InMemoryCalendarRepository } from '@/features/calendar/infrastructure/in-memory-calendar-repository'

const calendarRepository = new InMemoryCalendarRepository()

export const getCalendarEvents = () => calendarRepository.findAll()
