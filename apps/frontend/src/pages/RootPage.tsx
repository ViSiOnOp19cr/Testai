import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../services/authService'

/**
 * RootPage Component
 * 
 * This is the landing page at the root path ("/").
 * It doesn't display any content - it just redirects users based on their authentication status:
 * - If logged in → redirect to /home
 * - If not logged in → redirect to /login
 * 
 * This provides a smooth user experience by automatically sending users to the right place.
 */

export default function RootPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      // User is logged in, send them to home page
      navigate('/home')
    } else {
      // User is not logged in, send them to login page
      navigate('/login')
    }
  }, [navigate])

  // Show a simple loading message while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Redirecting...</div>
    </div>
  )
}
