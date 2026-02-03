import { useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/authService'
import Navbar from './Navbar'

/**
 * Layout Component
 * 
 * This is a wrapper component that provides:
 * 1. Authentication protection - redirects to login if not authenticated
 * 2. Consistent navigation bar across all protected pages
 * 3. Loading state while checking authentication
 * 4. Logout functionality
 * 
 * Usage: Wrap any protected page content with this component
 * Example: <Layout><YourPageContent /></Layout>
 */

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  // useNavigate is React Router's equivalent to Next.js useRouter
  const navigate = useNavigate()
  
  // State to store current user information
  const [user, setUser] = useState<any>(null)
  
  // State to show loading screen while checking authentication
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status when component mounts
  useEffect(() => {
    const currentUser = getCurrentUser()
    
    if (!currentUser) {
      // No user found, redirect to login page
      navigate('/login')
    } else {
      // User is authenticated, store user data and stop loading
      setUser(currentUser)
      setIsLoading(false)
    }
  }, [navigate])

  /**
   * Handle user logout
   * Clears user data and redirects to login page
   */
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Show loading screen while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Render the layout with navbar and page content
  return (
    <div className="min-h-screen bg-white">
      <Navbar userName={user.name} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
