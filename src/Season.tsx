import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSeasonQuery } from './gql'
import { Spinner } from './Spinner'
import { toDateString } from './util'
import { FULLIMGURL, IMGURL, Props } from './consts'

export function Season({ state, updateState }: Props) {

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

    season?.credits?.crew?.forEach(({ job }) => { if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!) })
    season?.images?.posters?.forEach(({ iso_639_1 }) => { if (posterLangOpts.findIndex(x => x === iso_639_1) === -1) posterLangOpts.push(iso_639_1!) })
    season?.videos?.results?.forEach(({ type }) => { if (videoFilterOpts.findIndex(x => x === type) === -1) videoFilterOpts.push(type!) })

    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <div className='err'> {error.message} </div>
    return <>
        <div className='img-bg' style={{ backgroundImage: `url(${IMGURL + season?.poster_path})` }}>
            <div className='blur-card'>
                {season?.poster_path && <img className='card-img' src={IMGURL + season.poster_path} alt='' />}
                <div className='card-text'>
                    <div> {season?.name} </div>
                    <div> {season?.episodes?.length} Episodes </div>
                    <div> {toDateString(season?.air_date!)} </div>
                </div>
            </div>
        </div>
        <div className='btn-row'>
            {['EPISODES', 'CAST', 'CREW', 'IMAGES', 'VIDEOS'].map((x, i) =>
                <div
                    className={`btn ${state.seasonTab === x ? 'bg3' : 'bg2'}`}
                    onClick={() => updateState({ seasonTab: x })}
                    key={i}> {x} </div>
            )}
        </div>
        {state.seasonTab === 'EPISODES' && <>
            <div className='grid123'>
                {season?.episodes?.map((x, i) =>
                    <Link className='bubble' key={i} to={`/tv/${id}/season/${season_number}/episode/${x.episode_number}`}>
                        {x.still_path && <img className='rounded-xl mb-2' src={IMGURL + x.still_path} alt='' />}
                        <div>
                            <span> {x.episode_number} | </span>
                            <span> {x.name} | </span>
                            <span> {toDateString(x.air_date!)} | </span>
                            {x.vote_average! > 0 && <span> {x.vote_average?.toFixed(1)} </span>}
                        </div>
                        <div className='subtext'> {x.overview} </div>
                    </Link>
                )}
            </div>
        </>}
        {state.seasonTab === 'CAST' &&
            <div className='grid123'>
                {season?.credits?.cast?.map((x, i) =>
                    <Link to={`/person/${x.id}`} className='card' key={i}>
                        {x.profile_path && <img className='card-img' src={IMGURL + x.profile_path} alt='' />}
                        <div className='card-text'>
                            <div> {x.name} </div>
                            <div className='subtext'> {x.character} </div>
                        </div>
                    </Link>
                )}
            </div>
        }
        {state.seasonTab === 'CREW' && <>
            <div className='single-row'>
                <select defaultValue={crewFilter}
                    className='sel'
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}>{x}</option>)}
                </select>
            </div>
            <div className='grid123'>
                {season?.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter === 'ALL') return true
                        if (job === crewFilter) return true
                        else return false
                    })
                    ?.map((x, i) =>
                        <Link to={`/person/${x.id}`} className='card' key={i}>
                            {x.profile_path && <img className='card-img' src={IMGURL + x.profile_path} alt='' />}
                            <div className='card-text'>
                                <div> {x.name} </div>
                                <div className='subtext'> {x.job} </div>
                            </div>
                        </Link>
                    )
                }
            </div>
        </>}
        {state.seasonTab === 'IMAGES' && <>
            <div className='single-row'>
                <select defaultValue={posterFilter}
                    className='sel'
                    onChange={e => setPosterFilter(e.target.value)}>
                    {posterLangOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                </select>
            </div>
            <div className='grid234'>
                {season?.images?.posters
                    ?.filter(x => x.iso_639_1 === posterFilter)
                    ?.map((x, i) =>
                        <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                            <img src={IMGURL + x.file_path} alt='' />
                        </a>
                    )
                }
            </div>
        </>}
        {state.seasonTab === 'VIDEOS' && <>
            <div className='single-row'>
                <select defaultValue={videoFilter}
                    className='sel'
                    onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                </select>
            </div>
            <div className='grid234'>
                {season?.videos?.results
                    ?.filter(({ type }) => {
                        if (videoFilter === 'ALL') return true
                        if (type === videoFilter) return true
                        else return false
                    })
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) =>
                        <div className='video-card' key={i}>
                            <a target='_blank' rel='noopener noreferrer' href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className='video-card-img' src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt='' />
                            </a>
                            <div className='video-card-text'>
                                <span> {x.name}  </span>
                                <span className='subtext'> {toDateString(x.published_at!)} </span>
                            </div>
                        </div>
                    )
                }
            </div>
        </>}
    </>
}
