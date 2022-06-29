import { createRoot } from 'react-dom/client'
import { App } from './App'
import { registerSW } from './SWRegister'
import './style.css'

createRoot(document.querySelector('#root')!).render(<App />)

registerSW()
