import { Link, useLocation } from 'react-router-dom'

/**
 * Navbar Component
 * 
 * This component provides the main navigation bar with:
 * 1. Brand logo/name that links to home
 * 2. Navigation links (Home, Docs, Projects) with active state highlighting
 * 3. User welcome message
 * 4. Logout button
 * 
 * The active route is highlighted with an orange border using React Router's useLocation
 */

interface NavbarProps {
  userName: string
  onLogout: () => void
}

export default function Navbar({ userName, onLogout }: NavbarProps) {
  // useLocation gives us the current route path
  // This is React Router's equivalent to Next.js usePathname
  const location = useLocation()

  /**
   * Check if a route is currently active
   * Returns the appropriate CSS classes for styling
   * 
   * @param path - The route path to check
   * @returns CSS class string for active or inactive state
   */
  const isActive = (path: string) => {
    return location.pathname === path
      ? 'border-[#ff6b35] text-gray-900'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and navigation links */}
          <div className="flex">
            {/* Brand logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/home"
                className="text-2xl font-bold text-[#ff6b35] hover:text-[#e55a2b] transition-colors"
              >
                Tstai
              </Link>
            </div>
            
            {/* Navigation links - hidden on small screens */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/home"
                className={`${isActive('/home')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/docs"
                className={`${isActive('/docs')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Docs
              </Link>
              <Link
                to="/projects"
                className={`${isActive('/projects')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Projects
              </Link>
              <Link
                to="/subscription"
                className={`${isActive('/subscription')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Billing
              </Link>
            </div>
          </div>
          
          {/* Right side - User info and logout button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-sm text-gray-700 mr-4">Welcome, {userName}</span>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff6b35] hover:bg-[#e55a2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6b35] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
