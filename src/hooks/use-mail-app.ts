'use client'

// React Imports
import { useCallback, useMemo, useState } from 'react'

// Type Imports
import type { Email, EmailLabel, EmailStatus, MailFilterTab, MailNavType } from '@/features/mail/domain'
import { buildMailListState } from '@/features/mail/application/mail-service'
import { getMail } from '@/features/mail'

export const useMailApp = () => {
  // States
  const [emails] = useState<Email[]>(getMail)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<EmailStatus>('inbox')
  const [activeLabel, setActiveLabel] = useState<EmailLabel | null>(null)
  const [activeNavType, setActiveNavType] = useState<MailNavType>('status')
  const [filterTab, setFilterTab] = useState<MailFilterTab>('all')

  const { statusCounts, labelCounts, visibleEmails, unreadCount } = useMemo(
    () => buildMailListState({ emails, activeNavType, activeStatus, activeLabel, searchQuery, filterTab }),
    [activeLabel, activeNavType, activeStatus, emails, filterTab, searchQuery]
  )

  const selectedEmail = useMemo(() => {
    if (selectedEmailId) {
      const selectedEmail = emails.find(email => email.id === selectedEmailId)

      if (selectedEmail && visibleEmails.some(email => email.id === selectedEmail.id)) {
        return selectedEmail
      }
    }

    return visibleEmails[0] ?? null
  }, [emails, selectedEmailId, visibleEmails])

  const handleStatusChange = useCallback((status: EmailStatus) => {
    setActiveNavType('status')
    setActiveStatus(status)
    setActiveLabel(null)
    setSelectedEmailId(null)
  }, [])

  const handleLabelChange = useCallback((label: EmailLabel) => {
    setActiveNavType('label')
    setActiveLabel(label)
    setSelectedEmailId(null)
  }, [])

  const handleEmailSelect = useCallback((email: Email) => {
    setSelectedEmailId(email.id)
  }, [])

  return {
    activeStatus,
    activeLabel,
    activeNavType,
    filterTab,
    searchQuery,
    statusCounts,
    labelCounts,
    visibleEmails,
    selectedEmail,
    unreadCount,
    setFilterTab,
    setSearchQuery,
    handleStatusChange,
    handleLabelChange,
    handleEmailSelect
  }
}
