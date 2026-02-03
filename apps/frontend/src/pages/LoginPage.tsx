import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'

/**
 * LoginPage Component
 * 
 * This page allows existing users to log in with their email and password.
 * Features:
 * 1. Email and password input fields
 * 2. Form validation
 * 3. Error display for failed login attempts
 * 4. Loading state during authentication
 * 5. Link to registration page for new users
 * 
 * After successful login, redirects to the home page.
 */

export default function LoginPage() {
  const navigate = useNavigate()
  
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  // Error message state
  const [error, setError] = useState('')
  
  // Loading state to disable form during submission
  const [loading, setLoading] = useState(false)

  /**
   * Handle input changes
   * Updates form data and clears any existing errors
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('') // Clear error when user starts typing
  }

  /**
   * Handle form submission
   * Validates input and attempts to log in
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent page reload
    setError('')

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    try {
      // Call the login service
      await login(formData.email, formData.password)
      
      // Success! Redirect to home page
      navigate('/home')
    } catch (err: any) {
      // Show error message
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-[#ff6b35] hover:text-[#e55a2b]">
              create a new account
            </Link>
          </p>
        </div>
        
        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {/* Input Fields */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#ff6b35] focus:border-[#ff6b35] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#ff6b35] focus:border-[#ff6b35] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff6b35] hover:bg-[#e55a2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6b35] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
