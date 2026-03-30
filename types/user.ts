export type UserTier = 'Silver' | 'Gold' | 'Platinum'

export type User = {
  id: string
  name: string
  email: string
  tier: UserTier
  stays: number
}
