import { render } from 'react-dom'
import { App } from './App'
import { register } from './serviceWorkerRegistration'
import './index.css'

render(<App />, document.querySelector('#root'))

register()
