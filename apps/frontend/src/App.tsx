import { Routes, Route } from 'react-router-dom'
import RootPage from './pages/RootPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import DocsPage from './pages/DocsPage'

/**
 * App Component - Root component with routing configuration
 * 
 * This component defines all the routes in the application using React Router v6.
 * Each route maps a URL path to a specific page component.
 * 
 * Routes:
 * - / : Root page (redirects to /login or /home based on auth status)
 * - /login : Login page for user authentication
 * - /register : Registration page for new users
 * - /home : Main dashboard (protected, requires authentication)
 * - /projects : API key management page (protected)
 * - /docs : Documentation page (protected)
 */

function App() {
  return (
    <Routes>
      {/* Root route - handles initial redirect based on authentication */}
      <Route path="/" element={<RootPage />} />
      
      {/* Public routes - accessible without authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes - require authentication (handled by Layout component) */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/docs" element={<DocsPage />} />
    </Routes>
  )
}

export default App
