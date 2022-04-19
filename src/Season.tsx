import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IMGURL, uniqueOnly } from './consts'
import { useSeasonQuery } from './gql'
import { Spinner } from './Spinner'

export function Season() {

    enum TAB {
        EPISODES = 'EPISODES',
        CAST = 'CAST',
        CREW = 'CREW',
        IMAGES = 'IMAGES',
        VIDEOS = 'VIDEOS'
    }

    let { id, season_number } = useParams()

    let [res, re] = useSeasonQuery({ id, season_number })
    let { data, fetching, error } = res

    let [tab, setTab] = useState(TAB.EPISODES)
    let [crewFilter, setCrewFilter] = useState('ALL')
    let [posterFilter, setPosterFilter] = useState('en')
    let [videoFilter, setVideoFilter] = useState('ALL')

    let season = data?.season

    let jobs: string[] = []
    let posterLangOpts: string[] = []
    let videoFilterOpts: string[] = []

    season?.credits?.crew?.forEach(({ job }) => { jobs.push(job!) })
    season?.images?.posters?.forEach(({ iso_639_1 }) => { posterLangOpts.push(iso_639_1!) })
    season?.videos?.results?.forEach(({ type }) => { videoFilterOpts.push(type!) })

    jobs.sort((a, b) => { return a > b ? 1 : -1 })
    jobs = jobs.filter(uniqueOnly)
    jobs.splice(0, 0, 'ALL')

    posterLangOpts = posterLangOpts.filter(uniqueOnly)
    videoFilterOpts = videoFilterOpts.filter(uniqueOnly)
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (season) return <>
        <div className='flex flex-row m-2'>
            <img className='w-40 rounded-xl mr-2' src={IMGURL + season.poster_path} alt='' />
            <div className='space-y-1'>
                <div> {season.name} </div>
                <div className='text-slate-400'> {season.episodes?.length} Episodes </div>
                <div className='text-slate-400'> {new Date(season.air_date!).toDateString().substring(4)} </div>
            </div>
        </div>
        <div className='flex flex-row m-2 space-x-2 overflow-scroll xl:overflow-hidden'>
            <button className={`rounded-xl px-3 py-1 ${tab == TAB.EPISODES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.EPISODES)}> EPISODES </button>
            <button className={`rounded-xl px-3 py-1 ${tab == TAB.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.CAST)}> CAST </button>
            <button className={`rounded-xl px-3 py-1 ${tab == TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.CREW)}> CREW </button>
            <button className={`rounded-xl px-3 py-1 ${tab == TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.IMAGES)}> IMAGES </button>
            <button className={`rounded-xl px-3 py-1 ${tab == TAB.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.VIDEOS)}> VIDEOS </button>
        </div>
        {tab == TAB.EPISODES && <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {season.episodes?.map((x, i) => {
                    return <Link to={`/tv/${id}/season/${season_number}/episode/${x.episode_number}`} key={i}
                        className='flex flex-col bg-slate-800 rounded-xl p-4 space-y-1 justify-center' >
                        {x.still_path && <img className='rounded-xl' src={IMGURL + x.still_path} alt='' />}
                        <div> {x.episode_number} | {x.name} | {new Date(x.air_date!).toDateString().substring(4)} </div>
                        <div> {x.overview} </div>
                    </Link>
                })}
            </div>
        </>}
        {tab == TAB.CAST && <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {season.credits?.cast?.map((x, i) => {
                    return <Link to={`/person/${x.id}`} className='flex flex-row' key={i}>
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
                {season.credits?.crew
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
        {tab == TAB.IMAGES && <>
            <div className='flex flex-row m-2 justify-center xl:justify-start'>
                <select defaultValue={posterFilter}
                    className='bg-slate-800 rounded-xl text-center px-3 py-1'
                    onChange={e => setPosterFilter(e.target.value)}>
                    {posterLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                </select>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                {season.images?.posters
                    ?.filter(x => x.iso_639_1 == posterFilter)
                    ?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
            </div>
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
                {season.videos?.results
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
