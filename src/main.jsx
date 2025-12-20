import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context'
import App from './App.jsx'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#3D2E22',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#7D9B76',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#C45C4A',
              secondary: '#FFFFFF',
            },
          },
        }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
