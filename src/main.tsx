import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App'
import { startSyncEngine } from './lib/sync'

startSyncEngine()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter><App /></HashRouter>
  </StrictMode>,
)
