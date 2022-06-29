import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEpisodeQuery } from './gql'
import { toDateString } from './util'
import { FULLIMGURL, IMGURL, Props } from './consts'
import { Stars } from './Stars'

export function Episode({ state, updateState }: Props) {

    let [crewFilter, setCrewFilter] = useState('ALL')

    let { id, season_number, episode_number } = useParams()
    let [res,] = useEpisodeQuery({ id, season_number, episode_number })
    let { data, fetching, error } = res
    let episode = data?.episode

    let crewFilterOpts: string[] = []
    episode?.crew?.forEach(({ job }) => { crewFilterOpts.push(job!) })
    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <div className='spinner' />
    if (error) return <div className='err'> {error.message} </div>
    return <>
        <div className='img-bg' style={{ backgroundImage: `url(${IMGURL + episode?.still_path})` }}>
            <div className='col bg-black bg-opacity-50 rounded-xl p-10 xl:p-20 space-y-2'>
                <div>
                    <span> S{episode?.season_number?.toString().padStart(2, '0')} </span>
                    <span> E{episode?.episode_number?.toString().padStart(2, '0')} </span>
                </div>
                <div> {episode?.name} </div>
                <div> {toDateString(episode?.air_date!)} </div>
                {episode?.vote_average! > 0 && <Stars average={episode?.vote_average!} />}
            </div>
        </div>
        <div className='btn-row'>
            {['INFO', 'GUEST', 'CREW', 'IMAGES'].map((x, i) =>
                <div
                    className={`btn ${state.episodeTab === x ? 'bg3' : 'bg2'}`}
                    onClick={() => updateState({ episodeTab: x })}
                    key={i}> {x} </div>
            )}
        </div>
        {state.episodeTab === 'INFO' && <div className='bubble'> {episode?.overview} </div>}
        {state.episodeTab === 'CREW' && <>
            <div className='single-row'>
                <select
                    defaultValue={crewFilter}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                </select>
            </div>
            <div className='grid123'>
                {episode?.crew
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
                    )}
            </div>
        </>}
        {state.episodeTab === 'GUEST' && <>
            <div className='grid123'>
                {episode?.guest_stars?.map((x, i) =>
                    <Link to={`/person/${x.id}`} className='card' key={i}>
                        {x.profile_path && <img className='card-img' src={IMGURL + x.profile_path} alt='' />}
                        <div className='card-text'>
                            <div> {x.name} </div>
                            <div className='subtext'> {x.character} </div>
                        </div>
                    </Link>
                )}
            </div>
        </>}
        {state.episodeTab === 'IMAGES' && <>
            <div className='grid123'>
                {episode?.images?.stills?.map((x, i) =>
                    <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                        <img src={IMGURL + x.file_path} alt='' />
                    </a>
                )}
            </div>
        </>}
    </>
}
