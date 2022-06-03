import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useShowQuery } from './gql'
import { Spinner } from './Spinner'
import { toDateString } from './util'
import { FULLIMGURL, IMGURL, Props } from './consts'
import { Stars } from './Stars'
import {
    BlurCard,
    Bubble,
    Button,
    ButtonRow,
    Card,
    CardImg,
    CardTextBox,
    Error,
    Grid123,
    Grid234,
    ImageBG,
    Select,
    SingleRow,
    SubText,
    VideoCard,
    VideoCardImg,
    VideoCardTextBox
} from './ThemeData'

export function Show({ state, updateState }: Props) {

    let [imageTab, setImageTab] = useState('POSTERS')
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

    show?.credits?.crew?.forEach(({ job }) => { if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!) })
    show?.images?.posters?.forEach(({ iso_639_1 }) => { if (posterLangOpts.findIndex(x => x === iso_639_1) === -1) posterLangOpts.push(iso_639_1!) })
    show?.images?.backdrops?.forEach(({ iso_639_1 }) => { if (backdropsLangOpts.findIndex(x => x === iso_639_1) === -1) backdropsLangOpts.push(iso_639_1!) })
    show?.videos?.results?.forEach(({ type }) => { if (videoFilterOpts.findIndex(x => x === type) === -1) videoFilterOpts.push(type!) })

    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    return <>
        <div className={ImageBG} style={{ backgroundImage: `url(${FULLIMGURL + show?.backdrop_path})` }}>
            <div className={BlurCard}>
                {show?.poster_path && <img className={CardImg} src={IMGURL + show.poster_path} alt='' />}
                <div className={CardTextBox}>
                    {show?.first_air_date && <div> {toDateString(show.first_air_date)} </div>}
                    {show?.name && <div> {show?.name} </div>}
                    {show?.tagline && <div className='text-sm'> {show.tagline} </div>}
                    {show?.vote_average! > 0 && <Stars average={show?.vote_average!} />}
                </div>
            </div>
        </div>
        <div className={ButtonRow}>
            {['INFO', 'CAST', 'CREW', 'SEASONS', 'IMAGES', 'VIDEOS'].map((x, i) =>
                <div
                    className={`${Button} ${state.showTab === x ? 'bg-slate-700' : 'bg-slate-800'}`}
                    onClick={() => updateState({ showTab: x })}
                    key={i}> {x} </div>
            )}
        </div>
        {state.showTab === 'INFO' && <>
            {show?.overview && <div className={Bubble}> {show.overview} </div>}
            <div className={Bubble}>
                {show?.status && <div> Status: {show.status} </div>}
                {show?.type && <div> Show Type: {show.type} </div>}
                {show?.episode_run_time && show.episode_run_time[0] && show.episode_run_time[0] > 0 && <div> Runtime: {show.episode_run_time[0]} Minutes </div>}
                {show?.number_of_seasons && show.number_of_seasons > 0 && <div> Seasons: {show.number_of_seasons} </div>}
                {show?.number_of_episodes && show.number_of_episodes > 0 && <div> Episodes: {show.number_of_episodes} </div>}
                {show?.external_ids?.imdb_id && <div>
                    <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.imdb.com/title/${show?.external_ids.imdb_id}`}> IMDB </a>
                    <span> ID: {show.external_ids.imdb_id} </span>
                </div>}
                <div>
                    <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.themoviedb.org/tv/${show?.id}`}> TMDB </a>
                    <span> ID: {id} </span>
                </div>
            </div>
            <div className={ButtonRow}>
                {show?.networks?.map((x, i) => <div className={Bubble} key={i}> {x.name} </div>)}
                {show?.production_companies?.map((x, i) => <div className={Bubble} key={i}> {x.name} </div>)}
            </div>
        </>}
        {state.showTab === 'CAST' &&
            <div className={Grid123}>
                {show?.credits?.cast?.map((x, i) =>
                    <Link to={`/person/${x.id}`} className={Card} key={i} >
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path!} alt='' />}
                        <div className={CardTextBox}>
                            {x.name && <div> {x.name} </div>}
                            {x.character && <div className={SubText}> {x.character} </div>}
                        </div>
                    </Link>
                )}
            </div>
        }
        {state.showTab === 'CREW' && <>
            <div className={SingleRow}>
                <select defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}>{x}</option>)}
                </select>
            </div>
            <div className={Grid123}>
                {show?.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter === 'ALL') return true
                        if (job === crewFilter) return true
                        else return false
                    })
                    ?.map((x, i) =>
                        <Link to={`/person/${x.id}`} className={Card} key={i} >
                            {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                            <div className={CardTextBox}>
                                {x.name && <div> {x.name} </div>}
                                {x.job && <div className={SubText}> {x.job} </div>}
                            </div>
                        </Link>
                    )
                }
            </div>
        </>}
        {state.showTab === 'SEASONS' && <>
            <div className={Grid123}>
                {show?.seasons && show?.seasons.map((x, i) =>
                    <Link to={`/tv/${id}/season/${x.season_number}`} className={Card} key={i}>
                        {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                        <div className={CardTextBox}>
                            {x.name && <div> {x.name} </div>}
                            {x.episode_count && x.episode_count > 0 && <div className={SubText}> {x.episode_count} Episodes </div>}
                            {x.air_date && <div className={SubText}> {toDateString(x.air_date)} </div>}
                        </div>
                    </Link>
                )}
            </div>
        </>}
        {state.showTab === 'IMAGES' && <>
            <div className={ButtonRow}>
                {['POSTERS', 'BACKDROPS'].map((x, i) =>
                    <div
                        className={`${Button} ${imageTab === x ? 'bg-slate-700' : 'bg-slate-800'}`}
                        onClick={() => setImageTab(x)}
                        key={i}> {x} </div>
                )}
                {imageTab === 'POSTERS' &&
                    <select defaultValue={posterFilter} className={Select} onChange={e => setPosterFilter(e.target.value)}>
                        {posterLangOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                    </select>
                }
                {imageTab === 'BACKDROPS' &&
                    <select defaultValue={backdropFilter} className={Select} onChange={e => setBackdropFilter(e.target.value)}>
                        {backdropsLangOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                    </select>
                }
            </div>
            {imageTab === 'POSTERS' &&
                <div className={Grid234}>
                    {show?.images?.posters
                        ?.filter(x => x.iso_639_1 === posterFilter)
                        ?.map((x, i) =>
                            <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                                <img src={IMGURL + x.file_path} alt='' />
                            </a>
                        )
                    }
                </div>
            }
            {imageTab === 'BACKDROPS' &&
                <div className={Grid123}>
                    {show?.images?.backdrops
                        ?.filter(x => x.iso_639_1 === backdropFilter)
                        ?.map((x, i) =>
                            <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                                <img src={IMGURL + x.file_path} alt='' />
                            </a>
                        )
                    }
                </div>
            }
        </>}
        {state.showTab === 'VIDEOS' && <>
            <div className={SingleRow}>
                <select defaultValue={videoFilter}
                    className={Select}
                    onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                </select>
            </div>
            <div className={Grid234}>
                {show?.videos?.results
                    ?.filter(({ type }) => {
                        if (videoFilter === 'ALL') return true
                        if (type === videoFilter) return true
                        else return false
                    })
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) =>
                        <div className={VideoCard} key={i}>
                            <a target='_blank' rel='noopener noreferrer' href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className={VideoCardImg} src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt='' />
                            </a>
                            <div className={VideoCardTextBox}>
                                {x.name && <span> {x.name} </span>}
                                {x.published_at && <span className={SubText}> {toDateString(x.published_at)} </span>}
                            </div>
                        </div>
                    )
                }
            </div>
        </>}
    </>
}
