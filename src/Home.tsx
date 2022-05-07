import { Link } from 'react-router-dom'
import { MovieResult, PersonResult, ShowResult, useFindQuery } from './gql'
import { Spinner } from './Spinner'
import { renderStars } from './util'
import { IMGURL, Props, TABS } from './consts'
import {
    Button,
    ButtonRow,
    Card,
    CardImg,
    CardSubText,
    CardTextBox,
    Error,
    Grid123
} from './ThemeData'

export function Home({ state, updateState }: Props) {
    return <>
        <div className='row xl:justify-center'>
            <input
                className='bg-slate-800 text-center text-xl w-full xl:w-auto p-2 rounded-xl'
                id='query'
                placeholder='SEARCH'
                type='text'
                onKeyDown={(e) => { if (e.key === 'Enter') { updateState({ query: e.currentTarget.value }) } }} />
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${state.homeTab === TABS.MOVIES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ homeTab: TABS.MOVIES })}> MOVIES </div>
            <div className={`${Button} ${state.homeTab === TABS.SHOWS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ homeTab: TABS.SHOWS })}> SHOWS </div>
            <div className={`${Button} ${state.homeTab === TABS.PEOPLE ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ homeTab: TABS.PEOPLE })}> PEOPLE </div>
        </div>
        <SearchResults state={state} updateState={updateState} />
    </>
}

function SearchResults({ state, updateState }: Props) {

    let nextPage = () => updateState({ page: state.page + 1 })
    let lastPage = () => updateState({ page: state.page - 1 })

    let [res,] = useFindQuery({
        query: state.query,
        page: state.page.toString()
    })
    let { data, fetching, error } = res
    let results = data?.find?.results

    let maxPages = data?.find?.total_pages

    let movies: MovieResult[] = results?.filter(x => x.media_type === 'movie')!
    let shows: ShowResult[] = results?.filter(x => x.media_type === 'tv')!
    let people: PersonResult[] = results?.filter(x => x.media_type === 'person')!

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    if (results) return <>
        <div className={Grid123}>
            {state.homeTab === TABS.MOVIES && <>
                {movies.map((x, i) => {
                    return <Link to={`/movie/${x.id}`} key={i} className={Card}>
                        {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                        <div className={CardTextBox}>
                            <div> {new Date(x.release_date!).getFullYear()} </div>
                            <div> {x.title} </div>
                            {x.vote_average! > 0 && <div> {renderStars(x.vote_average)} </div>}
                            <div className={CardSubText}>
                                {x.overview?.length! > 100 ? x.overview?.substring(0, 97).padEnd(100, '.') : x.overview}
                            </div>
                        </div>
                    </Link>
                })}
            </>}
            {state.homeTab === TABS.SHOWS && <>
                {shows.map((x, i) => {
                    return <Link to={`/tv/${x.id}`} key={i} className={Card}>
                        {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                        <div className={CardTextBox}>
                            <div> {new Date(x.first_air_date!).getFullYear()} </div>
                            <div> {x.name} </div>
                            {x.vote_average! > 0 && <div> {renderStars(x.vote_average)} </div>}
                            <div className={CardSubText}>
                                {x.overview?.length! > 100 ? x.overview?.substring(0, 97).padEnd(100, '.') : x.overview}
                            </div>
                        </div>
                    </Link>
                })}
            </>}
            {state.homeTab === TABS.PEOPLE && <>
                {people.map((x, i) => {
                    return <Link to={`/person/${x.id}`} key={i} className={Card}>
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                        <div className={CardTextBox}> {x.name} </div>
                    </Link>
                })}
            </>}
        </div>
        {state.query && <>
            <div className={ButtonRow}>
                <button className={Button + ' bg-slate-800'} disabled={state.page <= 1} onClick={lastPage}> BACK </button>
                <div className={Button + ' bg-slate-800'} > {state.page} </div>
                <button className={Button + ' bg-slate-800'} disabled={state.page >= maxPages!} onClick={nextPage}> NEXT </button>
            </div>
        </>}
    </>
    return <></>
}
