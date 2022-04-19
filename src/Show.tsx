import { useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { IMGURL, renderStars, uniqueOnly } from './consts'
import { useShowQuery } from './gql'
import { Spinner } from './Spinner'

export function Show() {

    enum TAB {
        INFO = 'INFO',
        CAST = 'CAST',
        CREW = 'CREW',
        SEASONS = 'SEASONS',
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
    let [crewFilter, setCrewFilter] = useState('ALL')
    let [posterFilter, setPosterFilter] = useState('en')
    let [backdropFilter, setBackdropFilter] = useState('en')
    let [videoFilter, setVideoFilter] = useState('ALL')

    let { id } = useParams()
    let [res, re] = useShowQuery({ id })
    let { data, fetching, error } = res

    let show = data?.show

    let jobs: string[] = []
    let posterLangOpts: string[] = []
    let backdropsLangOpts: string[] = []
    let videoFilterOpts: string[] = []

    show?.credits?.crew?.forEach(({ job }) => { jobs.push(job!) })
    show?.images?.posters?.forEach(({ iso_639_1 }) => { posterLangOpts.push(iso_639_1!) })
    show?.images?.backdrops?.forEach(({ iso_639_1 }) => { backdropsLangOpts.push(iso_639_1!) })
    show?.videos?.results?.forEach(({ type }) => { videoFilterOpts.push(type!) })

    jobs.sort((a, b) => { return a > b ? 1 : -1 })
    jobs = jobs.filter(uniqueOnly)
    jobs.splice(0, 0, 'ALL')

    posterLangOpts = posterLangOpts.filter(uniqueOnly)
    backdropsLangOpts = backdropsLangOpts.filter(uniqueOnly)
    videoFilterOpts = videoFilterOpts.filter(uniqueOnly)
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (show) return <>
        <div className='flex flex-row m-2'>
            {show.poster_path && <img className='w-40 rounded-xl mr-2' src={IMGURL + show.poster_path} alt='' />}
            <div className='space-y-1'>
                <div> {new Date(show.first_air_date!).getFullYear()} </div>
                <div> {show.name} </div>
                <div> {show.tagline} </div>
                <div className='flex flex-row space-x-1'> {renderStars(show.vote_average)} </div>
            </div>
        </div>
        <div className='flex flex-row m-2 space-x-2 overflow-scroll xl:overflow-hidden'>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.INFO })}> INFO </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CAST })}> CAST </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CREW })}> CREW </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.SEASONS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.SEASONS })}> SEASONS </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.IMAGES })}> IMAGES </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.VIDEOS })}> VIDEOS </button>
        </div>
        {tab == TAB.INFO && <>
            <div className='flex flex-row m-2'>
                <div className='bg-slate-800 rounded-xl p-4'> {show.overview} </div>
            </div>
            <div className='flex flex-col bg-slate-800 rounded-xl p-4 m-2'>
                <div> {show.episode_run_time![0]} Minutes </div>
                <div> {show.number_of_seasons} Seasons </div>
                <div> {show.number_of_episodes} Episodes </div>
                <div> <a className='underline' target='_blank' href={`https://www.imdb.com/title/${show.external_ids?.imdb_id}`}>IMDB</a> ID: {show.external_ids?.imdb_id} </div>
                <div> <a className='underline' target='_blank' href={`https://www.themoviedb.org/tv/${show.id}`}>TMDB</a> ID: {show.id} </div>
                <div> Homepage: <a className='underline' href={show.homepage} target='_blank'> {show.homepage} </a></div>
            </div>
            <div className='flex flex-row m-2 space-x-2 overflow-scroll xl:overflow-hidden'>
                {show.networks?.map((x, i) => {
                    return <div className='bg-slate-800 rounded-xl p-2' key={i}> {x.name} </div>
                })}
                {show.production_companies?.map((x, i) => {
                    return <div className='bg-slate-800 rounded-xl p-2' key={i}> {x.name} </div>
                })}
            </div>
        </>}
        {tab == TAB.CAST && <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {show.credits?.cast?.map((x, i) => {
                    return <Link to={`/person/${x.id}`} className='flex flex-row' key={i} >
                        {x.profile_path && <img className='w-32 rounded-xl mr-2' src={IMGURL + x.profile_path!} alt='' />}
                        <div className='space-y-1'>
                            <div> {x.name} </div>
                            <div className='text-slate-400'> {x.character} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab == TAB.CREW && <>
            <div className='flex flex-row m-2 justify-center xl:justify-start'>
                <select defaultValue={crewFilter}
                    className='bg-slate-800 rounded-xl text-center px-3 py-1'
                    onChange={e => setCrewFilter(e.target.value)}>
                    {jobs.map((x, i) => { return <option value={x} key={i}>{x}</option> })}
                </select>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {show.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter == 'ALL') return true
                        if (job == crewFilter) return true
                    })
                    .map((x, i) => {
                        return <Link to={`/person/${x.id}`} className='flex flex-row' key={i} >
                            {x.profile_path && <img className='w-32 rounded-xl mr-2' src={IMGURL + x.profile_path!} alt='' />}
                            <div className='space-y-1'>
                                <div> {x.name} </div>
                                <div className='text-slate-400'> {x.job} </div>
                            </div>
                        </Link>
                    })}
            </div>
        </>}
        {tab == TAB.SEASONS && <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {show.seasons?.map((x, i) => {
                    return <Link to={`/tv/${id}/season/${x.season_number}`} className='flex flex-row' key={i}>
                        {x.poster_path && <img className='w-40 rounded-xl mr-2' src={IMGURL + x.poster_path} alt='' />}
                        <div className='space-y-1'>
                            <div> {x.name} </div>
                            <div className='text-slate-400'> {x.episode_count} Episodes </div>
                            <div className='text-slate-400'> {new Date(x.air_date!).toDateString().substring(4)} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab == TAB.IMAGES && <>
            <div className='flex flex-row m-2 justify-evenly xl:justify-start xl:space-x-2'>
                <button className={`${imageTab == IMAGE_TAB.POSTERS ? 'bg-slate-700' : 'bg-slate-800'} py-1 px-3 rounded-xl`} onClick={e => setImageTab(IMAGE_TAB.POSTERS)}> POSTERS </button>
                <button className={`${imageTab == IMAGE_TAB.BACKDROPS ? 'bg-slate-700' : 'bg-slate-800'} py-1 px-3 rounded-xl`} onClick={e => setImageTab(IMAGE_TAB.BACKDROPS)}> BACKDROPS </button>
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
                    {show.images?.posters
                        ?.filter(x => x.iso_639_1 == posterFilter)
                        ?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
                </div>
            </>}
            {imageTab == IMAGE_TAB.BACKDROPS && <>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
                    {show.images?.backdrops
                        ?.filter(x => x.iso_639_1 == backdropFilter)
                        ?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
                </div>
            </>}
        </>}
        {tab == TAB.VIDEOS && <>
            <div className='flex flex-row m-2 justify-center xl:justify-start'>
                <select defaultValue={videoFilter}
                    className='bg-slate-800 px-3 py-1 rounded-xl text-center'
                    onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                </select>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 m-2 gap-4'>
                {show.videos?.results
                    ?.filter(({ type }) => {
                        if (videoFilter == 'ALL') return true
                        if (type == videoFilter) return true
                    })
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) => {
                        return <div className='flex flex-col' key={i}>
                            <a target='_blank' href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className='rounded' src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt='' />
                            </a>
                            <div className='mt-2'> {x.name} <span className='text-slate-400'> {new Date(x.published_at!).toDateString().substring(4)} </span> </div>
                        </div>
                    })}
            </div>
        </>}
    </>
    return <></>
}
