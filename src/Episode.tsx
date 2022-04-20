import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bubble, Button, ButtonRow, Card, CardImg, CardTextBox, Grid123, IMGURL, Select, SingleRow, SubText } from './consts'
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

    let { "0": res } = useEpisodeQuery({ id, season_number, episode_number })
    let { data, fetching, error } = res

    let [tab, setTab] = useState(TAB.INFO)
    let [crewFilter, setCrewFilter] = useState('ALL')

    let episode = data?.episode

    let jobs: string[] = []

    episode?.crew?.forEach(({ job }) => { jobs.push(job!) })

    jobs.sort((a, b) => { return a > b ? 1 : -1 })
    jobs.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (episode) return <>
        <div className='row'>
            <img className='rounded-xl' src={IMGURL + episode.still_path} alt='' />
        </div>
        <div className='col'>
            <div className={Bubble}>
                S{episode.season_number?.toString().padStart(2, '0')}E{episode.episode_number?.toString().padStart(2, '0')} | {episode.name} | {new Date(episode.air_date!).toDateString().substring(4)}
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TAB.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.INFO)}> INFO </div>
            <div className={`${Button} ${tab === TAB.GUEST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.GUEST)}> GUESTS </div>
            <div className={`${Button} ${tab === TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.CREW)}> CREW </div>
            <div className={`${Button} ${tab === TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setTab(TAB.IMAGES)}> IMAGES </div>
        </div>
        {tab === TAB.INFO && <>
            <div className={Bubble}> {episode.overview} </div>
        </>}
        {tab === TAB.CREW && <>
            <div className={SingleRow}>
                <select defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {jobs.map((x, i) => { return <option value={x} key={i}>{x}</option> })}
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
        {tab === TAB.GUEST && <>
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
        {tab === TAB.IMAGES && <>
            <div className={Grid123}>
                {episode.images?.stills?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
            </div>
        </>}
    </>
    return <></>
}
