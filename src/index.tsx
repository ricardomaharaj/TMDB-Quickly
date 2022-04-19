import { render } from 'react-dom'
import { App } from './App'
import { register } from './serviceWorkerRegistration'

render(<App />, document.querySelector('#root'))

register()
