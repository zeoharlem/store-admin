import type { UserProfilePageData } from '@/features/user-profile/domain'
import type { ProfileRepository } from '@/features/user-profile/domain/repositories/profile-repository'
import { db } from '@/fake-db/pages/user-profile'

export class InMemoryProfileRepository implements ProfileRepository {
  constructor(private readonly profile: UserProfilePageData = db) {}

  getProfile(): UserProfilePageData {
    return this.profile
  }
}
