/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */
'use server'

import { getCalendarEvents } from '@/features/calendar'
import { getMail } from '@/features/mail'
import { getProfileData as loadProfileData } from '@/features/user-profile'

// Calendar App Actions
export const getCalendarData = async () => {
  return getCalendarEvents()
}

// Mail App Actions
export const getMailData = async () => {
  return getMail()
}

// User Profile Actions
export const getProfileData = async () => loadProfileData()
