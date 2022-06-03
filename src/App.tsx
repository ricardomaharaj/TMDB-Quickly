import { createClient, Provider as UrqlProvider } from 'urql'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Home } from './Home'
import { Movie } from './Movie'
import { Show } from './Show'
import { Season } from './Season'
import { Episode } from './Episode'
import { Person } from './Person'
import { useState } from 'react'
import { GlobalState } from './consts'

let url = process.env.NODE_ENV === 'production' ? 'https://r8r-gql.herokuapp.com/' : 'http://localhost:4000/'

let urqlClient = createClient({ url })

export function App() {

    let [state, setState] = useState<GlobalState>({
        query: '',
        page: 1,
        homeTab: 'MOVIES',
        movieTab: 'INFO',
        showTab: 'INFO',
        seasonTab: 'EPISODES',
        episodeTab: 'INFO',
        personTab: 'BIO',
    })

    let updateState = (update: GlobalState) => setState({ ...state, ...update })

    document.querySelector('html')?.setAttribute('class', 'bg-slate-900 text-white')

    return <>
        <BrowserRouter>
            <UrqlProvider value={urqlClient} >
                <div className='container mx-auto'>
                    <div className='col m-2 space-y-2'>
                        <Link to='/' className='row w-full justify-center '>
                            <img
                                className='max-h-20 p-2'
                                src='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg'
                                alt='' />
                        </Link>
                        <Routes>
                            <Route path='/' element={<Home state={state} updateState={updateState} />} />
                            <Route path='/movie/:id' element={<Movie state={state} updateState={updateState} />} />
                            <Route path='/tv/:id' element={<Show state={state} updateState={updateState} />} />
                            <Route path='/tv/:id/season/:season_number' element={<Season state={state} updateState={updateState} />} />
                            <Route path='/tv/:id/season/:season_number/episode/:episode_number' element={<Episode state={state} updateState={updateState} />} />
                            <Route path='/person/:id' element={<Person state={state} updateState={updateState} />} />
                            <Route path='*' element={<Home state={state} updateState={updateState} />} />
                        </Routes>
                    </div>
                </div>
            </UrqlProvider>
        </BrowserRouter>
    </>
}
