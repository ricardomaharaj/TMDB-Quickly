import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bubble, Button, ButtonRow, Grid123, Grid234, IMGURL, Portrait, Poster, Select, SingleRow, SubText } from './consts'
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

    let { "0": res } = useSeasonQuery({ id, season_number })
    let { data, fetching, error } = res

    let [tab, setTab] = useState(TAB.EPISODES)
    let [crewFilter, setCrewFilter] = useState('ALL')
    let [videoFilter, setVideoFilter] = useState('ALL')
    let [posterFilter, setPosterFilter] = useState('en')

    let season = data?.season

    let crewFilterOpts: string[] = []
    let posterLangOpts: string[] = []
    let videoFilterOpts: string[] = []

    season?.credits?.crew?.forEach(({ job }) => {
        if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!)
    })
    season?.images?.posters?.forEach(({ iso_639_1 }) => {
        if (posterLangOpts.findIndex(x => x === iso_639_1) === -1) posterLangOpts.push(iso_639_1!)
    })
    season?.videos?.results?.forEach(({ type }) => {
        if (videoFilterOpts.findIndex(x => x === type) === -1) videoFilterOpts.push(type!)
    })

    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (season) return <>
        <div className='row'>
            {season.images && <img className={Poster} src={IMGURL + season.poster_path} alt='' />}
            <div>
                <div> {season.name} </div>
                <div className={SubText}> {season.episodes?.length} Episodes </div>
                <div className={SubText}> {new Date(season.air_date!).toDateString().substring(4)} </div>
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TAB.EPISODES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.EPISODES)}> EPISODES </div>
            <div className={`${Button} ${tab === TAB.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.CAST)}> CAST </div>
            <div className={`${Button} ${tab === TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.CREW)}> CREW </div>
            <div className={`${Button} ${tab === TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.IMAGES)}> IMAGES </div>
            <div className={`${Button} ${tab === TAB.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.VIDEOS)}> VIDEOS </div>
        </div>
        {tab === TAB.EPISODES && <>
            <div className={Grid123}>
                {season.episodes?.map((x, i) => {
                    return <Link
                        to={`/tv/${id}/season/${season_number}/episode/${x.episode_number}`}
                        className={Bubble}
                        key={i}
                    >
                        {x.still_path && <img className='rounded-xl mb-2' src={IMGURL + x.still_path} alt='' />}
                        <div> {x.episode_number} | {x.name} | {new Date(x.air_date!).toDateString().substring(4)} </div>
                        <div className={SubText}> {x.overview} </div>
                    </Link>
                })}
            </div>
        </>}
        {tab === TAB.CAST && <>
            <div className={Grid123}>
                {season.credits?.cast?.map((x, i) => {
                    return <Link
                        to={`/person/${x.id}`}
                        className='row'
                        key={i}
                    >
                        {x.profile_path && <img className={Portrait} src={IMGURL + x.profile_path!} alt='' />}
                        <div>
                            <div> {x.name} </div>
                            <div className={SubText}> {x.character} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab === TAB.CREW && <>
            <div className={SingleRow}>
                <select defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => { return <option value={x} key={i}>{x}</option> })}
                </select>
            </div>
            <div className={Grid123}>
                {season.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter === 'ALL') return true
                        if (job === crewFilter) return true
                        else return false
                    })
                    .map((x, i) => {
                        return <Link to={`/person/${x.id}`} className='row' key={i} >
                            {x.profile_path && <img className={Portrait} src={IMGURL + x.profile_path!} alt='' />}
                            <div>
                                <div> {x.name} </div>
                                <div className={SubText}> {x.job} </div>
                            </div>
                        </Link>
                    })}
            </div>
        </>}
        {tab === TAB.IMAGES && <>
            <div className={SingleRow}>
                <select defaultValue={posterFilter}
                    className={Select}
                    onChange={e => setPosterFilter(e.target.value)}>
                    {posterLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                </select>
            </div>
            <div className={Grid234}>
                {season.images?.posters
                    ?.filter(x => x.iso_639_1 === posterFilter)
                    ?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
            </div>
        </>}
        {tab === TAB.VIDEOS && <>
            <div className={SingleRow}>
                <select defaultValue={videoFilter}
                    className={Select}
                    onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                </select>
            </div>
            <div className={Grid234}>
                {season.videos?.results
                    ?.filter(({ type }) => {
                        if (videoFilter === 'ALL') return true
                        if (type === videoFilter) return true
                        else return false
                    })
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) => {
                        return <div className='col' key={i}>
                            <a target='_blank' rel='noopener noreferrer' href={`https://www.youtube.com/watch?v=${x.key}`}>
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
