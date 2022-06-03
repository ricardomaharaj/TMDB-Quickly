import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useEpisodeQuery } from './gql'
import { Spinner } from './Spinner'
import { toDateString } from './util'
import { FULLIMGURL, IMGURL, Props } from './consts'
import { Stars } from './Stars'
import {
    Bubble,
    Button,
    ButtonRow,
    Card,
    CardImg,
    CardTextBox,
    Error,
    Grid123,
    ImageBG,
    Select,
    SingleRow,
    SubText
} from './ThemeData'

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

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    return <>
        <div className={ImageBG} style={{ backgroundImage: `url(${FULLIMGURL + episode?.still_path})` }}>
            <div className='col backdrop-blur-sm backdrop-brightness-50 rounded-xl p-10 space-y-2'>
                <div>
                    <span> S{episode?.season_number?.toString().padStart(2, '0')} </span>
                    <span> E{episode?.episode_number?.toString().padStart(2, '0')} </span>
                </div>
                {episode?.name && <div> {episode?.name} </div>}
                {episode?.air_date && <div> {toDateString(episode?.air_date)} </div>}
                {episode?.vote_average && episode?.vote_average > 0 && <Stars average={episode?.vote_average} />}
            </div>
        </div>
        <div className={ButtonRow}>
            {['INFO', 'GUEST', 'CREW', 'IMAGES'].map((x, i) =>
                <div
                    className={`${Button} ${state.episodeTab === x ? 'bg-slate-700' : 'bg-slate-800'}`}
                    onClick={() => updateState({ episodeTab: x })}
                    key={i}> {x} </div>
            )}
        </div>
        {state.episodeTab === 'INFO' && <> {episode?.overview && <div className={Bubble}> {episode?.overview} </div>} </>}
        {state.episodeTab === 'CREW' && <>
            <div className={SingleRow}>
                <select defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}>{x}</option>)}
                </select>
            </div>
            <div className={Grid123}>
                {episode?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter === 'ALL') return true
                        if (job === crewFilter) return true
                        else return false
                    })
                    ?.map((x, i) =>
                        <Link to={`/person/${x.id}`} className={Card} key={i}>
                            {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                            <div className={CardTextBox}>
                                {x.name && <div> {x.name} </div>}
                                {x.job && <div className={SubText}> {x.job} </div>}
                            </div>
                        </Link>
                    )}
            </div>
        </>}
        {state.episodeTab === 'GUEST' && <>
            <div className={Grid123}>
                {episode?.guest_stars?.map((x, i) =>
                    <Link to={`/person/${x.id}`} className={Card} key={i}>
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                        <div className={CardTextBox}>
                            {x.name && <div> {x.name} </div>}
                            {x.character && <div className={SubText}> {x.character} </div>}
                        </div>
                    </Link>
                )}
            </div>
        </>}
        {state.episodeTab === 'IMAGES' && <>
            <div className={Grid123}>
                {episode?.images?.stills?.map((x, i) =>
                    <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                        <img src={IMGURL + x.file_path} alt='' />
                    </a>
                )}
            </div>
        </>}
    </>
}
