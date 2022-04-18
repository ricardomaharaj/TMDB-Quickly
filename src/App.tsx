import { createClient, Provider as UrqlProvider } from 'urql'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { API, FILM_ICON } from './consts'
import { Home } from './Home'
import { Movie } from './Movie'
import { Show } from './Show'
import { Season } from './Season'
import { Episode } from './Episode'
import { Person } from './Person'
import './App.css'

let urqlClient = createClient({ url: API })

export function App() {
    return <>
        <BrowserRouter>
            <UrqlProvider value={urqlClient} >
                <Link to={'/'} className='row' style={{ padding: '8px' }} >
                    <div> {FILM_ICON} </div>
                    <div> TMDB Quickly </div>
                </Link>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/movie/:id' element={<Movie />} />
                    <Route path='/tv/:id' element={<Show />} />
                    <Route path='/tv/:id/season/:season' element={<Season />} />
                    <Route path='/tv/:id/season/:season/episode/:episode' element={<Episode />} />
                    <Route path='/person/:id' element={<Person />} />
                    <Route path='*' element={<Home />} />
                </Routes>
            </UrqlProvider>
        </BrowserRouter>
    </>
}
