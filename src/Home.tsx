import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MovieResult, PersonResult, ShowResult, useFindQuery } from './gql'
import { Button, ButtonRow, Card, CardImg, CardSubText, CardTextBox, Grid123, IMGURL } from './consts'
import { Spinner } from './Spinner'
import { renderStars } from './util'

enum TAB {
    MOVIES = 'MOVIES',
    SHOWS = 'SHOWS',
    PEOPLE = 'PEOPLE',
}

export function Home() {
    let [params, setParams] = useSearchParams()

    let tab = params.get('tab') || TAB.MOVIES
    let page = params.get('page') || '1'
    let query = params.get('query') || ''

    useEffect(() => {
        if (query) {
            document.querySelector('#query')?.setAttribute('value', query)
        }
    }, [query])

    return <>
        <div className='row xl:justify-center'>
            <input
                className='bg-slate-800 text-center text-xl w-full xl:w-auto p-2 rounded-xl'
                id='query'
                placeholder='SEARCH'
                type='text'
                onKeyDown={(e: any) => { if (e.key === 'Enter') { setParams({ tab, page: '1', query: e.target.value }) } }} />
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TAB.MOVIES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setParams({ tab: TAB.MOVIES, query, page })}> MOVIES </div>
            <div className={`${Button} ${tab === TAB.SHOWS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setParams({ tab: TAB.SHOWS, query, page })}> SHOWS </div>
            <div className={`${Button} ${tab === TAB.PEOPLE ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setParams({ tab: TAB.PEOPLE, query, page })}> PEOPLE </div>
        </div>
        <SearchResults />
    </>
}

function SearchResults() {

    let [params, setParams] = useSearchParams()

    let query = params.get('query') || ''
    let page = params.get('page') || '1'
    let tab = params.get('tab') || TAB.MOVIES

    let pageInt = parseInt(page) || 1

    let nextPage = () => { setParams({ tab, query, page: `${pageInt + 1}` }) }
    let lastPage = () => { setParams({ tab, query, page: `${pageInt - 1}` }) }

    let { "0": res } = useFindQuery({ query, page })
    let { data, fetching, error } = res

    let maxPages = data?.find?.total_pages

    let results = data?.find?.results

    let movies: MovieResult[] = results?.filter(x => x.media_type === 'movie')!
    let shows: ShowResult[] = results?.filter(x => x.media_type === 'tv')!
    let people: PersonResult[] = results?.filter(x => x.media_type === 'person')!

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (results) return <>
        <div className={Grid123}>
            {tab === TAB.MOVIES && <>
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
            {tab === TAB.SHOWS && <>
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
            {tab === TAB.PEOPLE && <>
                {people.map((x, i) => {
                    return <Link to={`/person/${x.id}`} key={i} className={Card}>
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                        <div className={CardTextBox}> {x.name} </div>
                    </Link>
                })}
            </>}
        </div>
        {query && <>
            <div className={ButtonRow}>
                <button className={Button + ' bg-slate-800'} disabled={pageInt <= 1} onClick={lastPage}> BACK </button>
                <div className={Button + ' bg-slate-800'} > {pageInt} </div>
                <button className={Button + ' bg-slate-800'} disabled={pageInt >= maxPages!} onClick={nextPage}> NEXT </button>
            </div>
        </>}
    </>
    return <></>
}
