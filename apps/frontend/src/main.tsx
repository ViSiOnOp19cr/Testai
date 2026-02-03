import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'

/**
 * Main entry point for the React application
 * 
 * This file:
 * 1. Imports React and ReactDOM for rendering
 * 2. Wraps the app with BrowserRouter for client-side routing
 * 3. Imports global styles (includes Tailwind CSS)
 * 4. Renders the App component into the #root div in index.html
 */

// Get the root element from index.html
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Create a root and render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing throughout the app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
