import { getProfileData as loadProfileData } from '@/features/user-profile/application/profile-service'
import { InMemoryProfileRepository } from '@/features/user-profile/infrastructure/in-memory-profile-repository'

const profileRepository = new InMemoryProfileRepository()

export const getProfileData = () => loadProfileData(profileRepository)
