import type { CalendarEvent } from '@/features/calendar/domain'

export interface CalendarRepository {
  findAll(): CalendarEvent[]
}
