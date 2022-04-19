import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { IMGURL, renderStars, STAR } from './consts'
import { MovieResult, PersonResult, ShowResult, useFindQuery } from './gql'
import { Spinner } from './Spinner'

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
    }, [])

    return <>
        <div className='flex flex-row'>
            <input
                className='bg-slate-800 text-center text-xl w-full p-2 rounded-xl m-2'
                id='query'
                placeholder='SEARCH'
                type='text'
                onKeyDown={(e: any) => { if (e.key === 'Enter') { setParams({ tab, page: '1', query: e.target.value }) } }} />
        </div>
        <div className='flex flex-row m-2 justify-evenly xl:justify-start xl:space-x-2'>
            <button className={`py-1 px-3 rounded-xl ${tab == TAB.MOVIES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setParams({ tab: TAB.MOVIES, query, page })}> MOVIES </button>
            <button className={`py-1 px-3 rounded-xl ${tab == TAB.SHOWS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setParams({ tab: TAB.SHOWS, query, page })}> SHOWS </button>
            <button className={`py-1 px-3 rounded-xl ${tab == TAB.PEOPLE ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setParams({ tab: TAB.PEOPLE, query, page })}> PEOPLE </button>
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

    let [res, re] = useFindQuery({ query, page })
    let { data, fetching, error } = res

    let maxPages = data?.find?.total_pages

    let results = data?.find?.results

    let movies: MovieResult[] = results?.filter(x => x.media_type == 'movie')!
    let shows: ShowResult[] = results?.filter(x => x.media_type == 'tv')!
    let people: PersonResult[] = results?.filter(x => x.media_type == 'person')!

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (results) return <>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
            {tab == TAB.MOVIES && <>
                {movies.map((x, i) => {
                    return <Link to={`/movie/${x.id}`} key={i} className='flex flex-row'>
                        {x.poster_path && <img className='w-32 rounded-xl mr-2' src={IMGURL + x.poster_path} alt='' />}
                        <div className='space-y-1'>
                            <div> {new Date(x.release_date!).getFullYear()} </div>
                            <div> {x.title} </div>
                            {x.vote_average! > 0 && <div className='flex flex-row space-x-1'>{renderStars(x.vote_average)}</div>}
                        </div>
                    </Link>
                })}
            </>}
            {tab == TAB.SHOWS && <>
                {shows.map((x, i) => {
                    return <Link to={`/tv/${x.id}`} key={i} className='flex flex-row'>
                        {x.poster_path && <img className='w-32 rounded-xl mr-2' src={IMGURL + x.poster_path} alt='' />}
                        <div className='space-y-1'>
                            <div> {new Date(x.first_air_date!).getFullYear()} </div>
                            <div> {x.name} </div>
                            {x.vote_average! > 0 && <div className='flex flex-row space-x-1'>{renderStars(x.vote_average)}</div>}
                        </div>
                    </Link>
                })}
            </>}
            {tab == TAB.PEOPLE && <>
                {people.map((x, i) => {
                    return <Link to={`/person/${x.id}`} key={i} className='flex flex-row'>
                        {x.profile_path && <img className='w-32 rounded-xl mr-2' src={IMGURL + x.profile_path} alt='' />}
                        <div className='mt-1'> {x.name} </div>
                    </Link>
                })}
            </>}

        </div>
        {query && <>
            <div className='flex flex-row m-2 justify-evenly xl:justify-start xl:space-x-2'>
                <button className='bg-slate-800 px-4 py-1 rounded-xl' disabled={pageInt <= 1} onClick={lastPage}> BACK </button>
                <div    className='bg-slate-800 px-4 py-1 rounded-xl' > {pageInt} </div>
                <button className='bg-slate-800 px-4 py-1 rounded-xl' disabled={pageInt >= maxPages!} onClick={nextPage}> NEXT </button>
            </div>
        </>}
    </>
    return <></>
}
