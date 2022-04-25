import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEpisodeQuery } from './gql'
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
    Select,
    SingleRow,
    SubText
} from './ThemeData'

export function Episode() {

    let [tab, setTab] = useState(TABS.INFO)
    let [crewFilter, setCrewFilter] = useState('ALL')

    let { id, season_number, episode_number } = useParams()
    let [res,] = useEpisodeQuery({ id, season_number, episode_number })
    let { data, fetching, error } = res
    let episode = data?.episode

    let crewFilterOpts: string[] = []
    episode?.crew?.forEach(({ job }) => { crewFilterOpts.push(job!) })
    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    if (episode) return <>
        <div className='row'>
            <img className='rounded-xl' src={IMGURL + episode.still_path} alt='' />
        </div>
        <div className='col'>
            <div className={Bubble}>
                S{episode.season_number?.toString().padStart(2, '0')}E{episode.episode_number?.toString().padStart(2, '0')} | {episode.name} | {toDateString(episode.air_date)}
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TABS.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TABS.INFO)}> INFO </div>
            <div className={`${Button} ${tab === TABS.GUEST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TABS.GUEST)}> GUESTS </div>
            <div className={`${Button} ${tab === TABS.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TABS.CREW)}> CREW </div>
            <div className={`${Button} ${tab === TABS.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TABS.IMAGES)}> IMAGES </div>
        </div>
        {tab === TABS.INFO && <>
            <div className={Bubble}> {episode.overview} </div>
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
                {episode.crew
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
        {tab === TABS.GUEST && <>
            <div className={Grid123}>
                {episode.guest_stars?.map((x, i) => {
                    return <Link to={`/person/${x.id}`} className={Card} key={i} >
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path!} alt='' />}
                        <div className={CardTextBox}>
                            <div> {x.name} </div>
                            <div className={SubText}> {x.character} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab === TABS.IMAGES && <>
            <div className={Grid123}>
                {episode.images?.stills?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
            </div>
        </>}
    </>
    return <></>
}
