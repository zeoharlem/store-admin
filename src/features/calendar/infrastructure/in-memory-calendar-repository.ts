import type { CalendarEvent } from '@/features/calendar/domain'
import type { CalendarRepository } from '@/features/calendar/domain/repositories/calendar-repository'
import { db } from '@/fake-db/apps/calendar'

export class InMemoryCalendarRepository implements CalendarRepository {
  constructor(private readonly database: CalendarEvent[] = db) {}

  findAll(): CalendarEvent[] {
    return [...this.database]
  }
}
