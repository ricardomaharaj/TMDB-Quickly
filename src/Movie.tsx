import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { IMGURL, RELEASE_TYPES, renderStars, uniqueOnly } from './consts'
import { useMovieQuery } from './gql'
import { Spinner } from './Spinner'

export function Movie() {

    enum TAB {
        INFO = 'INFO',
        CAST = 'CAST',
        CREW = 'CREW',
        IMAGES = 'IMAGES',
        VIDEOS = 'VIDEOS'
    }

    enum IMAGE_TAB {
        POSTERS,
        BACKDROPS
    }

    let [params, setParams] = useSearchParams()

    let tab = params.get('tab') || TAB.INFO
    let [imageTab, setImageTab] = useState(IMAGE_TAB.POSTERS)

    let [posterFilter, setPosterFilter] = useState('en')
    let [backdropFilter, setBackdropFilter] = useState('en')
    let [crewFilter, setCrewFilter] = useState('ALL')

    let [videoFilter, setVideoFilter] = useState('Trailer')

    let { id } = useParams()

    let [res, re] = useMovieQuery({ id })
    let { data, fetching, error } = res

    let movie = data?.movie

    let releaseDates = movie?.release_dates?.results?.filter(x => x?.iso_3166_1 == 'US')[0]?.release_dates

    let jobs: string[] = []

    let posterLangOpts: string[] = []
    let backdropsLangOpts: string[] = []

    let videoFilterOpts: string[] = []

    movie?.credits?.crew?.forEach(({ job }) => { jobs.push(job!) })

    movie?.images?.posters?.forEach(({ iso_639_1 }) => { posterLangOpts.push(iso_639_1!) })
    movie?.images?.backdrops?.forEach(({ iso_639_1 }) => { backdropsLangOpts.push(iso_639_1!) })

    movie?.videos?.results?.forEach(({ type }) => { videoFilterOpts.push(type!) })

    jobs.sort((a, b) => { return a > b ? 1 : -1 })
    jobs = jobs.filter(uniqueOnly)
    jobs.splice(0, 0, 'ALL')

    posterLangOpts = posterLangOpts.filter(uniqueOnly)
    backdropsLangOpts = backdropsLangOpts.filter(uniqueOnly)

    videoFilterOpts = videoFilterOpts.filter(uniqueOnly)

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (movie) return <>
        <div className='flex flex-row m-2'>
            {movie.poster_path && <img className='w-40 rounded-xl mr-2' src={IMGURL + movie.poster_path} alt='' />}
            <div className='space-y-1'>
                <div> {new Date(movie.release_date!).getFullYear()} </div>
                <div> {movie.title}  </div>
                <div> {movie.tagline} </div>
                <div className='flex flex-row space-x-1'> {renderStars(movie.vote_average)} </div>
            </div>
        </div>
        <div className='flex flex-row m-2 justify-evenly xl:justify-start xl:space-x-2'>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.INFO })}> INFO </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CAST })}> CAST </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CREW })}> CREW </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.IMAGES })}> IMAGES </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.VIDEOS })}> VIDEOS </button>
        </div>
        {tab == TAB.INFO && <>
            <div className='m-2 space-y-2'>
                <div className='bg-slate-800 rounded-xl p-4'>{movie.overview}</div>
                <div className='rounded-xl bg-slate-800 p-4'>
                    {movie.status && <div> Status: {movie.status} </div>}
                    {movie.runtime && <div> Runtime: {movie.runtime} Minutes </div>}
                    {movie.budget && <div> Budget: ${movie.budget.toLocaleString()} </div>}
                    {movie.revenue && <div> Revenue: ${movie.revenue.toLocaleString()} </div>}
                    {movie.homepage && <div> Homepage: <a className='underline' href={movie.homepage}> {movie.homepage} </a> </div>}
                    {movie.original_language && <div> Original Language: {movie.original_language} </div>}
                    {movie.original_title && <div> Original Title: {movie.original_title} </div>}
                    {movie.imdb_id && <div> <a className='underline' target='_blank' href={`https://www.imdb.com/title/${movie.imdb_id}`}>IMDB</a> ID: {movie.imdb_id} </div>}
                    {movie.id && <div> <a className='underline' target='_blank' href={`https://www.themoviedb.org/movie/${movie.id}`}>TMDB</a> ID: {movie.id} </div>}
                </div>
                <div className='flex flex-row space-x-2 overflow-scroll xl:overflow-hidden'>
                    {releaseDates?.map((x, i) => {
                        return <div className='bg-slate-800 rounded-xl p-2' key={i}>
                            <div className='text-sm'> {RELEASE_TYPES[x.type!]} </div>
                            <div className='text-sm'> {new Date(x.release_date!).toDateString().substring(4)} </div>
                        </div>
                    })}
                </div>
            </div>
        </>}
        {tab == TAB.CAST && <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {movie.credits?.cast?.map((x, i) => {
                    return <Link to={`/person/${x.id}`} key={i} className='flex flex-row'>
                        {x.profile_path && <img className='w-32 rounded-xl mr-2' src={IMGURL + x.profile_path} alt='' />}
                        <div>
                            <div> {x.name} </div>
                            <div className='text-slate-400'> {x.character} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab == TAB.CREW && <>
            <div className='flex flex-row m-2 justify-evenly xl:justify-start'>
                <select defaultValue={crewFilter} className='bg-slate-800 px-3 py-1 rounded-xl text-center' onChange={e => setCrewFilter(e.target.value)}>
                    {jobs.map((x, i) => { return <option value={x} key={i}> {x} </option> })}
                </select>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {movie.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter == 'ALL') return true
                        if (job == crewFilter) return true
                    })
                    .map((x, i) => {
                        return <Link to={`/person/${x.id}`} key={i} className='flex flex-row'>
                            {x.profile_path && <img className='w-32 rounded-xl mr-2' src={IMGURL + x.profile_path} alt='' />}
                            <div>
                                <div> {x.name} </div>
                                <div className='text-slate-400'> {x.job} </div>
                            </div>
                        </Link>
                    })}
            </div>
        </>}
        {tab == TAB.IMAGES && <>
            <div className='flex flex-row m-2 justify-evenly xl:justify-start xl:space-x-2'>
                <button className={`py-1 px-3 rounded-xl ${imageTab == IMAGE_TAB.POSTERS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setImageTab(IMAGE_TAB.POSTERS)}> POSTERS </button>
                <button className={`py-1 px-3 rounded-xl ${imageTab == IMAGE_TAB.BACKDROPS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setImageTab(IMAGE_TAB.BACKDROPS)}> BACKDROPS </button>
                {imageTab == IMAGE_TAB.POSTERS && <>
                    {imageTab == IMAGE_TAB.POSTERS && <>
                        <select defaultValue={posterFilter}
                            className='bg-slate-800 rounded-full text-center px-3 py-1'
                            onChange={e => setPosterFilter(e.target.value)}>
                            {posterLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                        </select>
                    </>}
                </>}
                {imageTab == IMAGE_TAB.BACKDROPS && <>
                    {imageTab == IMAGE_TAB.BACKDROPS && <>
                        <select defaultValue={backdropFilter}
                            className='bg-slate-800 rounded-full text-center px-3 py-1'
                            onChange={e => setBackdropFilter(e.target.value)}>
                            {backdropsLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                        </select>
                    </>}
                </>}
            </div>
            {imageTab == IMAGE_TAB.POSTERS && <>
                <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                    {movie.images?.posters
                        ?.filter(x => x.iso_639_1 == posterFilter)
                        ?.map((x, i) => {
                            return <img src={IMGURL + x.file_path} alt='' key={i} />
                        })}
                </div>
            </>}
            {imageTab == IMAGE_TAB.BACKDROPS && <>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                    {movie.images?.backdrops
                        ?.filter(x => x.iso_639_1 == backdropFilter)
                        ?.map((x, i) => {
                            return <div key={i}>
                                <img src={IMGURL + x.file_path} alt='' />
                            </div>
                        })}
                </div>
            </>}
        </>}
        {tab == TAB.VIDEOS && <>
            <div className='flex flex-row m-2 justify-evenly xl:justify-start'>
                <select defaultValue={videoFilter}
                    className='bg-slate-800 px-3 py-1 rounded-xl text-center'
                    onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                </select>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 m-2 gap-4'>
                {movie.videos?.results
                    ?.filter(x => x.type == videoFilter)
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) => {
                        return <div className='flex flex-col' key={i}>
                            <a target='_blank' href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className='rounded' src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt="" />
                            </a>
                            <div className='mt-2'> {x.name} <span className='text-slate-400'> {new Date(x.published_at!).toDateString().substring(4)} </span> </div>
                        </div>
                    })}
            </div>
        </>}
    </>
    return <></>
}
