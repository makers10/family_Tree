import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Profile } from '@/types'

export function useSubscription() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchProfile()
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) {
        // If profile doesn't exist, it might be a race condition with the trigger
        // We'll treat it as free for now
        console.error('Error fetching profile:', error)
      } else if (data) {
        setProfile({
          id: data.id,
          isPremium: data.is_premium,
          subscriptionTier: data.subscription_tier,
          updatedAt: data.updated_at
        })
      }
    } catch (err) {
      console.error('Subscription hook error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    isPremium: profile?.isPremium ?? false,
    subscriptionTier: profile?.subscriptionTier ?? 'free',
    loading,
    refetch: fetchProfile
  }
}
