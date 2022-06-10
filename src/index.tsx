import { createRoot } from 'react-dom/client'
import { App } from './App'
import { registerSW } from './serviceWorkerRegistration'
import './index.css'

createRoot(document.querySelector('#root')!).render(<App />)

registerSW()
