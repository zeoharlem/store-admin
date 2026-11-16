import { isSameDay } from 'date-fns'

import type { CalendarEvent, events } from '@/features/calendar/domain'

const EVENT_TYPES: events[] = ['etc', 'family', 'business', 'personal', 'holiday']

const LEGACY_COLOR_TO_EVENT_TYPE: Record<string, events> = {
  amber: 'family',
  violet: 'business',
  rose: 'personal',
  emerald: 'holiday',
  orange: 'family',
  sky: 'etc'
}

export function normalizeEventType(color?: string): events {
  if (color && EVENT_TYPES.includes(color as events)) {
    return color as events
  }

  return LEGACY_COLOR_TO_EVENT_TYPE[color || ''] || 'etc'
}

export function isMultiDayEvent(event: CalendarEvent): boolean {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)

  return event.allDay || eventStart.getDate() !== eventEnd.getDate()
}

export function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events
    .filter(event => isSameDay(day, new Date(event.start)))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a)
    const bIsMultiDay = isMultiDayEvent(b)

    if (aIsMultiDay && !bIsMultiDay) return -1
    if (!aIsMultiDay && bIsMultiDay) return 1

    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })
}

export function getSpanningEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter(event => {
    if (!isMultiDayEvent(event)) return false

    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    return !isSameDay(day, eventStart) && (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
  })
}

export function getAllEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    return isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd)
  })
}
