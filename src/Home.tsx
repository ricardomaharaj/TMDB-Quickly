import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { IMGURL } from './consts'
import { MovieResult, PersonResult, ShowResult, useFindQuery } from './gql'
import { Spinner } from './Spinner'

enum TAB {
    MOVIES = 'MOVIES',
    TV = 'TV SHOWS',
    PEOPLE = 'PEOPLE'
}

export function Home() {

    let [params, setParams] = useSearchParams()

    let query = params.get('query') || ''
    let page = params.get('page') || '1'
    let tab = params.get('tab') || TAB.MOVIES

    let pageInt = parseInt(page)

    useEffect(() => {
        if (query) {
            document.querySelector('#query')?.setAttribute('value', query)
        }
    }, [])

    return <>
        <div className='row'>
            <input id='query' placeholder='Search' type='text' onKeyDown={(e: any) => { if (e.key === 'Enter') { setParams({ tab, page: '1', query: e.target.value }) } }} />
        </div>
        <div className='row'>
            <div className={`${tab == TAB.MOVIES && 'selected'}`} onClick={() => setParams({ tab: TAB.MOVIES, query, page })}> MOVIES </div>
            <div>|</div>
            <div className={`${tab == TAB.TV && 'selected'}`} onClick={() => setParams({ tab: TAB.TV, query, page })}> TV SHOWS </div>
            <div>|</div>
            <div className={`${tab == TAB.PEOPLE && 'selected'}`} onClick={() => setParams({ tab: TAB.PEOPLE, query, page })}> PEOPLE </div>
            {query && <>
                <div>|</div>
                <div onClick={() => { if (pageInt > 1) { setParams({ query, tab, page: `${pageInt - 1}` }) } }}> &lt; </div>
                <div> PAGE {page} </div>
                <div onClick={() => { setParams({ query, tab, page: `${pageInt + 1}` }) }}> &gt; </div>
            </>}
        </div>
        <hr />
        <SearchResults />
    </>
}

function SearchResults() {

    let [params, setParams] = useSearchParams()

    let query = params.get('query') || ''
    let page = params.get('page') || '1'
    let tab = params.get('tab') || TAB.MOVIES

    let [res, re] = useFindQuery({ query, page })
    let { data, fetching, error } = res

    let results = data?.find?.results

    let movies: MovieResult[] = results?.filter(x => x.media_type == 'movie')!
    let shows: ShowResult[] = results?.filter(x => x.media_type == 'tv')!
    let people: PersonResult[] = results?.filter(x => x.media_type == 'person')!

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (results) return <>
        {tab == TAB.MOVIES && <>
            {movies.map((x, i) => {
                return <div className='row' key={i}>
                    {x.poster_path ? <>
                        <Link to={`/movie/${x.id}`} className='col'>
                            <img src={IMGURL + x.poster_path} alt='' />
                        </Link>
                        <div className='col'>
                            <div> {x.title} | {x.release_date?.substring(0, 4)} </div>
                            <div> {x.overview} </div>
                        </div>
                    </> : <>
                        <Link to={`movie/${x.id}`} className='col'>
                            <div> {x.title} | {x.release_date} </div>
                            <div> {x.overview} </div>
                        </Link>
                    </>}
                </div>
            })}
        </>}
        {tab == TAB.TV && <>
            {shows.map((x, i) => {
                return <div className='row' key={i}>
                    {x.poster_path ? <>
                        <Link to={`/tv/${x.id}`} className='col'>
                            <img src={IMGURL + x.poster_path} alt='' />
                        </Link>
                        <div className='col'>
                            <div> {x.name} | {x.first_air_date?.substring(0, 4)} </div>
                            <div> {x.overview} </div>
                        </div>
                    </> : <>
                        <Link to={`/tv/${x.id}`} className='col'>
                            <div> {x.name} | {x.first_air_date} </div>
                            <div> {x.overview} </div>
                        </Link>
                    </>}
                </div>
            })}
        </>}
        {tab == TAB.PEOPLE && <>
            {people.map((x, i) => {
                return <div className='row' key={i}>
                    {x.profile_path ? <>
                        <Link to={`/person/${x.id}`} className='col' >
                            <img src={IMGURL + x.profile_path} alt='' />
                        </Link>
                        <div className='col'>
                            <div> {x.name} </div>
                        </div>
                    </> : <>
                        <Link to={`/person/${x.id}`} className='col' >
                            <div> {x.name} </div>
                        </Link>
                    </>}
                </div>
            })}
        </>}
    </>
    return <></>
}
