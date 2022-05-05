import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useShowQuery } from './gql'
import { Spinner } from './Spinner'
import { renderStars, toDateString } from './util'
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

export function Show() {

    let [tab, setTab] = useState(TABS.INFO)
    let [imageTab, setImageTab] = useState(TABS.POSTERS)
    let [crewFilter, setCrewFilter] = useState('ALL')
    let [videoFilter, setVideoFilter] = useState('ALL')
    let [posterFilter, setPosterFilter] = useState('en')
    let [backdropFilter, setBackdropFilter] = useState('en')

    let { id } = useParams()
    let [res,] = useShowQuery({ id })
    let { data, fetching, error } = res
    let show = data?.show

    let crewFilterOpts: string[] = []
    let posterLangOpts: string[] = []
    let backdropsLangOpts: string[] = []
    let videoFilterOpts: string[] = []

    show?.credits?.crew?.forEach(({ job }) => {
        if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!)
    })
    show?.images?.posters?.forEach(({ iso_639_1 }) => {
        if (posterLangOpts.findIndex(x => x === iso_639_1) === -1) posterLangOpts.push(iso_639_1!)
    })
    show?.images?.backdrops?.forEach(({ iso_639_1 }) => {
        if (backdropsLangOpts.findIndex(x => x === iso_639_1) === -1) backdropsLangOpts.push(iso_639_1!)
    })
    show?.videos?.results?.forEach(({ type }) => {
        if (videoFilterOpts.findIndex(x => x === type) === -1) videoFilterOpts.push(type!)
    })

    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    if (show) return <>
        <div className={Card}>
            {show.poster_path && <img className={CardImg} src={IMGURL + show.poster_path} alt='' />}
            <div className={CardTextBox}>
                <div> {toDateString(show.first_air_date)} </div>
                <div> {show.name} </div>
                <div> {show.tagline} </div>
                <div> {renderStars(show.vote_average)} </div>
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TABS.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.INFO)}> INFO </div>
            <div className={`${Button} ${tab === TABS.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.CAST)}> CAST </div>
            <div className={`${Button} ${tab === TABS.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.CREW)}> CREW </div>
            <div className={`${Button} ${tab === TABS.SEASONS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.SEASONS)}> SEASONS </div>
            <div className={`${Button} ${tab === TABS.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.IMAGES)}> IMAGES </div>
            <div className={`${Button} ${tab === TABS.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => setTab(TABS.VIDEOS)}> VIDEOS </div>
        </div>
        {tab === TABS.INFO && <>
            <div className={Bubble}> {show.overview} </div>
            <div className={Bubble}>
                <div> Status: {show.status} </div>
                <div> Show Type: {show.type} </div>
                <div> Runtime: {show.episode_run_time![0]} Minutes </div>
                <div> Seasons: {show.number_of_seasons} </div>
                <div> Episodes: {show.number_of_episodes} </div>
                <div> <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.imdb.com/title/${show.external_ids?.imdb_id}`}>IMDB</a> ID: {show.external_ids?.imdb_id} </div>
                <div> <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.themoviedb.org/tv/${show.id}`}>TMDB</a> ID: {show.id} </div>
                <div> Homepage: <a className='underline' href={show.homepage} target='_blank' rel='noopener noreferrer'> {show.homepage} </a></div>
            </div>
            <div className={ButtonRow}>
                {show.networks?.map((x, i) => {
                    return <div className={Bubble} key={i}> {x.name} </div>
                })}
                {show.production_companies?.map((x, i) => {
                    return <div className={Bubble} key={i}> {x.name} </div>
                })}
            </div>
        </>}
        {tab === TABS.CAST && <>
            <div className={Grid123}>
                {show.credits?.cast?.map((x, i) => {
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
        {tab === TABS.CREW && <>
            <div className={SingleRow}>
                <select defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => { return <option value={x} key={i}>{x}</option> })}
                </select>
            </div>
            <div className={Grid123}>
                {show.credits?.crew
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
        {tab === TABS.SEASONS && <>
            <div className={Grid123}>
                {show.seasons?.map((x, i) => {
                    return <Link to={`/tv/${id}/season/${x.season_number}`} className={Card} key={i}>
                        {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                        <div className={CardTextBox}>
                            {x.name === `Season ${x.season_number}` ? <>
                                <div> {x.name} </div>
                            </> : <>
                                <div> Season {x.season_number} </div>
                                <div> {x.name} </div>
                            </>}
                            <div className={SubText}> {x.episode_count} Episodes </div>
                            <div className={SubText}> {toDateString(x.air_date)} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab === TABS.IMAGES && <>
            <div className={ButtonRow}>
                <div
                    className={`${Button} ${imageTab === TABS.POSTERS ? 'bg-slate-700' : 'bg-slate-800'}`}
                    onClick={e => setImageTab(TABS.POSTERS)}> POSTERS </div>
                <div
                    className={`${Button} ${imageTab === TABS.BACKDROPS ? 'bg-slate-700' : 'bg-slate-800'}`}
                    onClick={e => setImageTab(TABS.BACKDROPS)}> BACKDROPS </div>
                {imageTab === TABS.POSTERS && <>
                    {imageTab === TABS.POSTERS && <>
                        <select defaultValue={posterFilter}
                            className={Select}
                            onChange={e => setPosterFilter(e.target.value)}>
                            {posterLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                        </select>
                    </>}
                </>}
                {imageTab === TABS.BACKDROPS && <>
                    {imageTab === TABS.BACKDROPS && <>
                        <select defaultValue={backdropFilter}
                            className={Select}
                            onChange={e => setBackdropFilter(e.target.value)}>
                            {backdropsLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                        </select>
                    </>}
                </>}
            </div>
            {imageTab === TABS.POSTERS && <>
                <div className={Grid234}>
                    {show.images?.posters
                        ?.filter(x => x.iso_639_1 === posterFilter)
                        ?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
                </div>
            </>}
            {imageTab === TABS.BACKDROPS && <>
                <div className={Grid123}>
                    {show.images?.backdrops
                        ?.filter(x => x.iso_639_1 === backdropFilter)
                        ?.map((x, i) => { return <img src={IMGURL + x.file_path} alt='' key={i} /> })}
                </div>
            </>}
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
                {show.videos?.results
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
