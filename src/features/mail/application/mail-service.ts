import type { Email, EmailLabel, EmailStatus, MailFilterTab, MailNavType } from '@/features/mail/domain'

const EMAIL_STATUSES: EmailStatus[] = ['inbox', 'sent', 'drafts', 'spam', 'trash', 'archive']
const EMAIL_LABELS: EmailLabel[] = ['social', 'updates', 'forums', 'shopping', 'promotions']

export const buildMailListState = ({
  emails,
  activeNavType,
  activeStatus,
  activeLabel,
  searchQuery,
  filterTab
}: {
  emails: Email[]
  activeNavType: MailNavType
  activeStatus: EmailStatus
  activeLabel: EmailLabel | null
  searchQuery: string
  filterTab: MailFilterTab
}) => {
  const statusCounts = Object.fromEntries(EMAIL_STATUSES.map(status => [status, 0])) as Record<EmailStatus, number>
  const labelCounts = Object.fromEntries(EMAIL_LABELS.map(label => [label, 0])) as Record<EmailLabel, number>

  for (const email of emails) {
    statusCounts[email.status] += 1

    if (email.status === 'inbox') {
      for (const label of email.labels) {
        labelCounts[label] += 1
      }
    }
  }

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const filteredEmails = emails.filter(email => {
    if (activeNavType === 'label') {
      if (email.status !== 'inbox' || !activeLabel || !email.labels.includes(activeLabel)) {
        return false
      }
    } else if (email.status !== activeStatus) {
      return false
    }

    if (!normalizedSearchQuery) {
      return true
    }

    return (
      email.subject.toLowerCase().includes(normalizedSearchQuery) ||
      email.from.toLowerCase().includes(normalizedSearchQuery) ||
      email.preview.toLowerCase().includes(normalizedSearchQuery) ||
      email.body.toLowerCase().includes(normalizedSearchQuery)
    )
  })

  const visibleEmails =
    filterTab === 'unread' ? filteredEmails.filter(email => !email.isRead) : filteredEmails

  return {
    statusCounts,
    labelCounts,
    filteredEmails,
    visibleEmails,
    unreadCount: filteredEmails.filter(email => !email.isRead).length
  }
}
