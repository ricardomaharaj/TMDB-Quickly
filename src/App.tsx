import { createClient, Provider } from 'urql'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Home } from './Home'
import { Movie } from './Movie'
import { Show } from './Show'
import { Season } from './Season'
import { Episode } from './Episode'
import { Person } from './Person'
import './App.css'
import { LOGO } from './consts'

let url: string = 'http://localhost:4000/gql'
if (process.env.NODE_ENV === 'production') url = '/gql'

let urqlClient = createClient({ url })

export function App() {
    document.querySelector('html')?.setAttribute('class', 'bg-slate-900 text-white')
    return <>
        <BrowserRouter>
            <Provider value={urqlClient} >
                <div className='container mx-auto'>
                    <div className='col m-2 space-y-2'>
                        <Link to='/' className='row w-full justify-center '>
                            <img className='max-h-20 p-2' src={LOGO} alt="" />
                        </Link>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/movie/:id' element={<Movie />} />
                            <Route path='/tv/:id' element={<Show />} />
                            <Route path='/tv/:id/season/:season_number' element={<Season />} />
                            <Route path='/tv/:id/season/:season_number/episode/:episode_number' element={<Episode />} />
                            <Route path='/person/:id' element={<Person />} />
                            <Route path='*' element={<Home />} />
                        </Routes>
                    </div>
                </div>
            </Provider>
        </BrowserRouter>
    </>
}
