import '@/styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app/App'
import { registerServiceWorker } from '@/app/serviceWorker'
import { applyTheme, readTheme } from '@/features/theme/theme'

applyTheme(readTheme())
if (import.meta.env.PROD) registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
