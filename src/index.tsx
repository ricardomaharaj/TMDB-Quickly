import { createRoot } from 'react-dom/client'
import { App } from './App'
import { register } from './serviceWorkerRegistration'
import './index.css'

createRoot(document.querySelector('#root')!).render(<App />)

register()
