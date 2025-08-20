import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster 
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          fontSize: '14px',
        },
        className: 'class',
      }}
    />
  </StrictMode>,
)
