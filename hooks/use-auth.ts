"use client"

import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase, createAnonymousUser, getCurrentProfile } from "@/lib/supabase"
import { Database } from "@/types/supabase"

type Profile = Database['public']['Tables']['profiles']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Securely get the initial user
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch profile whenever the user changes
  useEffect(() => {
    if (user) {
      getCurrentProfile()
        .then(setProfile)
        .catch(error => {
          console.error("Failed to get profile:", error)
          setProfile(null)
        })
    } else {
      setProfile(null)
    }
  }, [user])

  const signInAnonymously = async () => {
    try {
      const user = await createAnonymousUser()
      setUser(user)
      const profile = await getCurrentProfile()
      setProfile(profile)
      return { user, profile }
    } catch (error) {
      console.error('Error signing in anonymously:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return {
    user,
    profile,
    loading,
    signInAnonymously,
    signOut,
    isAuthenticated: !!user,
    isAnonymous: profile?.type === 'anonymous',
  }
}
