/**
 * EducaGames PRO v2.5
 * Desenvolvido por: Otávio Merlo Carvalho (2026)
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'rgba(13,13,43,0.95)',
              color: '#e2e8f0',
              border: '1px solid rgba(130,100,255,0.3)',
              backdropFilter: 'blur(12px)',
              fontFamily: "'Exo 2', sans-serif",
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#07071a' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#07071a' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
