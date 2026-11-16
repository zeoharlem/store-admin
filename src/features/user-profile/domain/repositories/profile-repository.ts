import type { UserProfilePageData } from '@/features/user-profile/domain'

export interface ProfileRepository {
  getProfile(): UserProfilePageData
}
