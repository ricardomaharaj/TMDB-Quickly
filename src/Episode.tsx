import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IMGURL, uniqueOnly } from './consts'
import { useEpisodeQuery } from './gql'
import { Spinner } from './Spinner'

export function Episode() {

    enum TAB {
        INFO = 'INFO',
        CREW = 'CREW',
        GUEST = 'GUEST',
        IMAGES = 'IMAGES'
    }

    let { id, season_number, episode_number } = useParams()

    let [res, re] = useEpisodeQuery({ id, season_number, episode_number })
    let { data, fetching, error } = res

    let [tab, setTab] = useState(TAB.INFO)
    let [crewFilter, setCrewFilter] = useState('ALL')

    let episode = data?.episode

    let jobs: string[] = []

    episode?.crew?.forEach(({ job }) => { jobs.push(job!) })

    jobs.sort((a, b) => { return a > b ? 1 : -1 })
    jobs = jobs.filter(uniqueOnly)
    jobs.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (episode) return <>
        <div className='flex flex-row m-2'>
            <img className='rounded-xl' src={IMGURL + episode.still_path} alt='' />
        </div>
        <div className='flex flex-col m-2'>
            <div className='bg-slate-800 rounded-xl py-2 px-4'>
                S{episode.season_number?.toString().padStart(2, '0')}E{episode.episode_number?.toString().padStart(2, '0')} | {episode.name} | {new Date(episode.air_date!).toDateString().substring(4)}
            </div>
        </div>
        <div className='flex flex-row m-2 space-x-2 overflow-scroll xl:overflow-hidden'>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.INFO)}> INFO </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.GUEST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.GUEST)}> GUESTS </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.CREW)}> CREW </button>
            <button className={`px-3 py-1 rounded-xl ${tab == TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.IMAGES)}> IMAGES </button>
        </div>
        {tab == TAB.INFO && <>
            <div className='flex flex-row bg-slate-800 m-2 rounded-xl space-y-1'>
                <div className='p-4'> {episode.overview} </div>
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
                {episode.crew
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
        {tab == TAB.GUEST && <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 m-2 gap-2'>
                {episode.guest_stars?.map((x, i) => {
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
        {tab == TAB.IMAGES && <>
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                {episode.images?.stills
                    ?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
            </div>
        </>}
    </>
    return <></>
}
