import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { App } from './App'
import { register } from './serviceWorkerRegistration'
import './index.css'

let root = document.querySelector('#root')!

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
)

register()
