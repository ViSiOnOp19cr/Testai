import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/authService'
import { sendOtp, verifyOtp } from '../services/otpService'

/**
 * RegisterPage Component
 * 
 * This page allows new users to create an account with email verification.
 * Features:
 * 1. Email verification via OTP before registration
 * 2. Form with name, email, password, and confirm password fields
 * 3. Client-side validation (password matching, minimum length)
 * 4. Error display for validation and server errors
 * 5. Loading state during registration
 * 6. Link to login page for existing users
 * 
 * After successful email verification and registration, redirects to login page.
 */

export default function RegisterPage() {
  const navigate = useNavigate()
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  
  // Error message state
  const [error, setError] = useState('')
  
  // Loading state
  const [loading, setLoading] = useState(false)

  /**
   * Handle input changes
   * Updates form data and clears errors
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('') // Clear error when user types
  }

  /**
   * Handle sending OTP to email
   * Validates email before sending
   */
  const handleSendOtp = async () => {
    setOtpError('')
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      setOtpError('Please enter a valid email address')
      return
    }

    setSendingOtp(true)
    try {
      await sendOtp(formData.email, 'signup')
      setOtpSent(true)
      setOtpError('')
      // Success message will be shown in UI
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  /**
   * Handle verifying OTP
   * Verifies the entered OTP code
   */
  const handleVerifyOtp = async () => {
    setOtpError('')
    
    if (!otp || otp.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP')
      return
    }

    setVerifyingOtp(true)
    try {
      await verifyOtp(formData.email, otp, 'signup')
      setEmailVerified(true)
      setOtpError('')
      // Success message will be shown in UI
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  /**
   * Handle form submission
   * Validates input and creates new user account
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Check if email is verified
    if (!emailVerified) {
      setError('Please verify your email before registering')
      return
    }

    // Validation checks
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      // Call the register service
      await register(formData.email, formData.password, formData.name)
      
      // Success! Redirect to login page
      navigate('/login')
    } catch (err: any) {
      // Show error message
      setError(err.message || 'Registration failed. Please try again.')
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-[#ff6b35] hover:text-[#e55a2b]">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {/* Input Fields */}
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#ff6b35] focus:border-[#ff6b35] focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            {/* Email Field with Verification */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={emailVerified}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    emailVerified 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ff6b35] focus:border-[#ff6b35] focus:z-10 sm:text-sm disabled:opacity-75`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !formData.email}
                    className="whitespace-nowrap px-4 py-2 border border-[#ff6b35] text-sm font-medium text-[#ff6b35] hover:bg-[#ff6b35] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6b35] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Verify Email'}
                  </button>
                )}
                {emailVerified && (
                  <div className="flex items-center px-3 py-2 bg-green-500 text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* OTP Input Field (shown after OTP is sent) */}
            {otpSent && !emailVerified && (
              <div className="relative">
                <label htmlFor="otp" className="sr-only">
                  Enter OTP
                </label>
                <div className="flex gap-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={4}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ff6b35] focus:border-[#ff6b35] focus:z-10 sm:text-sm"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otp.length !== 4}
                    className="whitespace-nowrap px-4 py-2 bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#e55a2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6b35] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
                {otpError && (
                  <p className="mt-1 text-xs text-red-600">{otpError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Check your email for the OTP code</p>
              </div>
            )}
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#ff6b35] focus:border-[#ff6b35] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#ff6b35] focus:border-[#ff6b35] focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !emailVerified}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff6b35] hover:bg-[#e55a2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6b35] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
            {!emailVerified && !loading && (
              <p className="mt-2 text-center text-xs text-gray-500">
                Please verify your email to continue
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
