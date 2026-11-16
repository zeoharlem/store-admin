import type { UserProfilePageData } from '@/features/user-profile/domain'
import type { ProfileRepository } from '@/features/user-profile/domain/repositories/profile-repository'

export const getProfileData = (repository: ProfileRepository): UserProfilePageData => repository.getProfile()
