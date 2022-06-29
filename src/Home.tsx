import { Link } from 'react-router-dom'
import { useSearchQuery } from './gql'
import { IMGURL, Props } from './consts'
import { Stars } from './Stars'

export function Home({ state, updateState }: Props) {

    let clearQuery = () => {
        document.querySelector<HTMLInputElement>('#query')!.value = ''
        updateState({ query: '' })
    }

    return <>
        <div className='bg2 px-4 py-2 text-xl rounded-xl w-full'>
            <input type='text' id='query' placeholder='SEARCH' defaultValue={state.query}
                className='bg2 outline-none xl:w-96'
                onKeyDown={e => e.key === 'Enter' ? updateState({ query: e.currentTarget.value }) : null} />
            {state.query && <div className='font-extrabold float-right' onClick={clearQuery}> X </div>}
        </div>
        <div className='btn-row'>
            {[
                { name: 'MOVIES', val: 'movie' },
                { name: 'SHOWS', val: 'tv' },
                { name: 'PEOPLE', val: 'person' },
            ].map((x, i) =>
                <div
                    className={`btn ${state.homeTab === x.val ? 'bg3' : 'bg2'}`}
                    onClick={() => updateState({ homeTab: x.val })}
                    key={i}> {x.name} </div>
            )}
        </div>
        <SearchResults state={state} updateState={updateState} />
    </>
}

function SearchResults({ state, updateState }: Props) {

    document.title = 'TMDB Quickly'

    let nextPage = () => updateState({ page: state.page + 1 })
    let lastPage = () => updateState({ page: state.page - 1 })

    let [res] = useSearchQuery({ query: state.query, page: state.page.toString() })
    let { data, fetching, error } = res

    let results = data?.search?.results
    let maxPages = data?.search?.total_pages

    if (fetching) return <div className='spinner' />
    if (error) return <div className='err'> {error.message} </div>
    return <>
        <div className='grid123'>
            {results?.filter(x => x.media_type === state.homeTab).map((x, i) =>
                <Link to={`${x.media_type}/${x.id}`} className='card' key={i}>
                    {(x.poster_path || x.profile_path) && <img src={IMGURL + (x.poster_path || x.profile_path)} alt='' className='card-img' />}
                    <div className='card-text'>
                        {(state.query && (x.release_date || x.first_air_date)) && <div>{(x.release_date || x.first_air_date)?.substring(0, 4)}</div>}
                        <div> {(x.name || x.title)} </div>
                        {x.vote_average! > 0 && <Stars average={x.vote_average} />}
                        {x.overview && <div className='subtext'>
                            {x.overview.length > 100
                                ? x.overview.substring(0, 97).padEnd(100, '.')
                                : x.overview}
                        </div>}
                    </div>
                </Link>
            )}
        </div>
        {state.query &&
            <div className='btn-row'>
                <button className='btn bg2' disabled={state.page <= 1} onClick={lastPage}>BACK</button>
                <div className='btn bg2'> {state.page} </div>
                <button className='btn bg2' disabled={state.page >= maxPages!} onClick={nextPage}>NEXT</button>
            </div>
        }
    </>
}
