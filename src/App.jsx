// src/App.jsx
import React from 'react'
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom'
import Login from './components/auth/Login'
import HODDashboard from './pages/HODDashboard'
import { supabase } from './services/supabase'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/hod-dashboard" 
          element={
            <ProtectedRoute 
              component={HODDashboard} 
              requiredRole="HOD" 
            />
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

// Protected Route Component
const ProtectedRoute = ({ component: Component, requiredRole }) => {
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const checkAuthorization = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setIsAuthorized(false)
        setIsLoading(false)
        return
      }

      // Fetch user role
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.user.email)
        .single()

      if (error || userData.role !== requiredRole) {
        setIsAuthorized(false)
      } else {
        setIsAuthorized(true)
      }
      
      setIsLoading(false)
    }

    checkAuthorization()
  }, [requiredRole])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />
  }

  return <Component />
}

export default App