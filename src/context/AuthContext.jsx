import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

// Create context
const AuthContext = createContext(null)

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check user session and fetch profile
  useEffect(() => {
    const checkUser = async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        
        // Fetch user profile
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (userProfile) {
          setProfile(userProfile)
        }
      }
      
      setLoading(false)
    }

    // Initial check
    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user)
          
          // Fetch profile when signed in
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()

          setProfile(userProfile)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          navigate('/login')
        }
      }
    )

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  // Authentication Methods
  const signUp = async (email, password, profileData) => {
    // Register user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: profileData
      }
    })

    if (signUpError) throw signUpError

    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: data.user.id,
        ...profileData
      })

    if (profileError) throw profileError

    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Context value
  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}