import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSeasonQuery } from './gql'
import { Spinner } from './Spinner'
import { toDateString } from './util'
import { IMGURL, TABS } from './consts'
import {
    Bubble,
    Button,
    ButtonRow,
    Card,
    CardImg,
    CardTextBox,
    Error,
    Grid123,
    Grid234,
    Select,
    SingleRow,
    SubText,
    VideoCard,
    VideoCardImg,
    VideoCardTextBox
} from './ThemeData'

export function Season() {

    let [tab, setTab] = useState(TABS.EPISODES)
    let [crewFilter, setCrewFilter] = useState('ALL')
    let [videoFilter, setVideoFilter] = useState('ALL')
    let [posterFilter, setPosterFilter] = useState('en')

    let { id, season_number } = useParams()
    let [res,] = useSeasonQuery({ id, season_number })
    let { data, fetching, error } = res
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
    if (error) return <div className={Error}> {error.message} </div>
    if (season) return <>
        <div className={Card}>
            {season.images && <img className={CardImg} src={IMGURL + season.poster_path} alt='' />}
            <div className={CardTextBox}>
                {season.name === `Season ${season.season_number}` ? <>
                    <div> {season.name} </div>
                </> : <>
                    <div> Season {season.season_number} </div>
                    <div> {season.name} </div>
                </>}
                <div className={SubText}> {season.episodes?.length} Episodes </div>
                <div className={SubText}> {toDateString(season.air_date)} </div>
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TABS.EPISODES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.EPISODES)}> EPISODES </div>
            <div className={`${Button} ${tab === TABS.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.CAST)}> CAST </div>
            <div className={`${Button} ${tab === TABS.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.CREW)}> CREW </div>
            <div className={`${Button} ${tab === TABS.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.IMAGES)}> IMAGES </div>
            <div className={`${Button} ${tab === TABS.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.VIDEOS)}> VIDEOS </div>
        </div>
        {tab === TABS.EPISODES && <>
            <div className={Grid123}>
                {season.episodes?.map((x, i) => {
                    return <Link
                        to={`/tv/${id}/season/${season_number}/episode/${x.episode_number}`}
                        className={Bubble}
                        key={i}
                    >
                        {x.still_path && <img className='rounded-xl mb-2' src={IMGURL + x.still_path} alt='' />}
                        <div> {x.episode_number} | {x.name} | {toDateString(x.air_date)} </div>
                        <div className={SubText}> {x.overview} </div>
                    </Link>
                })}
            </div>
        </>}
        {tab === TABS.CAST && <>
            <div className={Grid123}>
                {season.credits?.cast?.map((x, i) => {
                    return <Link
                        to={`/person/${x.id}`}
                        className={Card}
                        key={i}
                    >
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path!} alt='' />}
                        <div className={CardTextBox}>
                            <div> {x.name} </div>
                            <div className={SubText}> {x.character} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab === TABS.CREW && <>
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
                        return <Link to={`/person/${x.id}`} className={Card} key={i} >
                            {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path!} alt='' />}
                            <div className={CardTextBox}>
                                <div> {x.name} </div>
                                <div className={SubText}> {x.job} </div>
                            </div>
                        </Link>
                    })}
            </div>
        </>}
        {tab === TABS.IMAGES && <>
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
        {tab === TABS.VIDEOS && <>
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
                        return <div className={VideoCard} key={i}>
                            <a target='_blank' rel='noopener noreferrer' href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className={VideoCardImg} src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt='' />
                            </a>
                            <div className={VideoCardTextBox}> {x.name} <span className={SubText}> {toDateString(x.published_at)} </span> </div>
                        </div>
                    })}
            </div>
        </>}
    </>
    return <></>
}
