import { createClient, Provider } from 'urql'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { API } from './consts'
import { Home } from './Home'
import { Movie } from './Movie'
import { Show } from './Show'
import { Season } from './Season'
import { Episode } from './Episode'
import { Person } from './Person'
import './App.css'

let urqlClient = createClient({ url: API })

export function App() {
    document.querySelector('html')?.setAttribute('class', 'bg-slate-900 text-white')
    return <>
        <BrowserRouter>
            <Provider value={urqlClient} >
                <div className='container mx-auto'>
                    <Link to='/' className='flex flex-row w-full justify-center p-4 text-xl'>
                        TMDB QUICKLY
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
            </Provider>
        </BrowserRouter>
    </>
}
