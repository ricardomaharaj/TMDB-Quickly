import { Link } from 'react-router-dom'
import { MovieResult, PersonResult, ShowResult, useSearchQuery } from './gql'
import { Spinner } from './Spinner'
import { IMGURL, Props, TABS } from './consts'
import { Stars } from './Stars'
import {
    Button,
    ButtonRow,
    Card,
    CardImg,
    CardSubText,
    CardTextBox,
    Error,
    Grid123,
} from './ThemeData'

export function Home({ state, updateState }: Props) {
    let clearQuery = () => {
        document.querySelector<HTMLInputElement>('#query')!.value = ''
        updateState({ query: '' })
    }
    return <>
        <div className='row'>
            <input type='text' id='query' placeholder='SEARCH' defaultValue={state.query}
                className='bg-slate-800 text-center text-xl w-full p-2 rounded-xl'
                onKeyDown={e => { if (e.key === 'Enter') updateState({ query: e.currentTarget.value }) }} />
            {state.query &&
                <div className='text-center fixed mx-2 text-xl font-extrabold p-2' onClick={clearQuery}> X </div>
            }
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${state.homeTab === TABS.MOVIES ? 'bg-slate-700' : 'bg-slate-800'}`}
                onClick={() => updateState({ homeTab: TABS.MOVIES })}> MOVIES </div>
            <div className={`${Button} ${state.homeTab === TABS.SHOWS ? 'bg-slate-700' : 'bg-slate-800'}`}
                onClick={() => updateState({ homeTab: TABS.SHOWS })}> SHOWS </div>
            <div className={`${Button} ${state.homeTab === TABS.PEOPLE ? 'bg-slate-700' : 'bg-slate-800'}`}
                onClick={() => updateState({ homeTab: TABS.PEOPLE })}> PEOPLE </div>
        </div>
        <SearchResults state={state} updateState={updateState} />
    </>
}

function SearchResults({ state, updateState }: Props) {

    let nextPage = () => updateState({ page: state.page + 1 })
    let lastPage = () => updateState({ page: state.page - 1 })

    let [res] = useSearchQuery({ query: state.query, page: state.page.toString() })
    let { data, fetching, error } = res

    let results = data?.search?.results
    let maxPages = data?.search?.total_pages

    let movies: MovieResult[] = results?.filter(x => x.media_type === 'movie')!
    let shows: ShowResult[] = results?.filter(x => x.media_type === 'tv')!
    let people: PersonResult[] = results?.filter(x => x.media_type === 'person')!

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    return <>
        <div className={Grid123}>
            {state.homeTab === TABS.MOVIES &&
                movies.map((x, i) =>
                    <Link to={`/movie/${x.id}`} key={i} className={Card}>
                        {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                        <div className={CardTextBox}>
                            {x.release_date && <div> {x.release_date.substring(0, 4)} </div>}
                            {x.title && <div> {x.title} </div>}
                            {x.vote_average && x.vote_average > 0 && <Stars average={x.vote_average!} />}
                            {x.overview && <div className={CardSubText}>
                                {x.overview.length > 100 ? x.overview.substring(0, 97).padEnd(100, '.') : x.overview}
                            </div>}
                        </div>
                    </Link>
                )
            }
            {state.homeTab === TABS.SHOWS &&
                shows.map((x, i) =>
                    <Link to={`/tv/${x.id}`} key={i} className={Card}>
                        {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                        <div className={CardTextBox}>
                            {x.first_air_date && <div> {x.first_air_date.substring(0, 4)} </div>}
                            {x.name && <div> {x.name} </div>}
                            {x.vote_average && x.vote_average > 0 && <Stars average={x.vote_average} />}
                            {x.overview && <div className={CardSubText}>
                                {x.overview.length > 100 ? x.overview.substring(0, 97).padEnd(100, '.') : x.overview}
                            </div>}
                        </div>
                    </Link>
                )
            }
            {state.homeTab === TABS.PEOPLE &&
                people.map((x, i) =>
                    <Link to={`/person/${x.id}`} key={i} className={Card}>
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                        {x.name && <div className={CardTextBox}> {x.name} </div>}
                    </Link>
                )
            }
        </div>
        {state.query &&
            <div className={ButtonRow}>
                <button className={Button + ' bg-slate-800'} disabled={state.page <= 1} onClick={lastPage}>BACK</button>
                <div className={Button + ' bg-slate-800'}> {state.page} </div>
                <button className={Button + ' bg-slate-800'} disabled={state.page >= maxPages!} onClick={nextPage}>NEXT</button>
            </div>
        }
    </>
}
