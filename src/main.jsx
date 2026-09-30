import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { parsePath } from './router'
import { pagePath } from './data/seo'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Built pages arrive pre-rendered: attach to that HTML instead of redrawing it.
// Only when it is the HTML for *this* URL: appointment slips and old links are
// served from a fallback file, and in development the page starts empty.
const { page, param } = parsePath(window.location.pathname, window.location.hash)
if (root.firstElementChild && root.dataset.route === (pagePath(page, param) || 'home')) {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
