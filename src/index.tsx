import { createRoot } from 'react-dom/client'
import { App } from './App'
import { SWregister } from './serviceWorkerRegistration'
import './index.css'

createRoot(document.querySelector('#root')!).render(<App />)

SWregister()
