import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePersonQuery } from './gql'
import { Spinner } from './Spinner'
import { toDateString } from './util'
import { IMGURL, Props, TABS } from './consts'
import { Stars } from './Stars'
import {
    ButtonRow,
    Button,
    SubText,
    Grid123,
    Bubble,
    Grid234,
    SingleRow,
    Select,
    Card,
    CardImg,
    CardTextBox,
    Error
} from './ThemeData'

export function Person({ state, updateState }: Props) {

    let [castFilter, setCastFilter] = useState('movie')
    let [crewFilter, setCrewFilter] = useState('ALL')

    let { id } = useParams()
    let [res,] = usePersonQuery({ id })
    let { data, fetching, error } = res
    let person = data?.person

    let crewFilterOpts: string[] = []
    person?.combined_credits?.crew?.forEach(({ job }) => { if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!) })
    crewFilterOpts.splice(0, 0, 'ALL')

    let calculateAge = (birthday?: string, deathday?: string) => {
        let age: number = 0
        let start: Date = new Date(birthday?.replace('-', '/')!)
        let end: Date = new Date()
        if (deathday) end = new Date(deathday?.replace('-', '/')!)
        age = end.getFullYear() - start.getFullYear()
        return <> Age: {age} </>
    }

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    return <>
        <div className={Card}>
            {person?.profile_path && <img className={CardImg} src={IMGURL + person?.profile_path} alt='' />}
            <div className={CardTextBox}>
                {person?.name && <div> {person?.name} </div>}
                {person?.birthday && <div> Born: {toDateString(person?.birthday)} </div>}
                {person?.deathday && <> Died: {toDateString(person?.deathday)} </>}
                {person?.birthday && <div> {calculateAge(person?.birthday, person?.deathday)} </div>}
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${state.personTab === TABS.BIO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ personTab: TABS.BIO })} > BIO </div>
            <div className={`${Button} ${state.personTab === TABS.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ personTab: TABS.CAST })} > CAST </div>
            <div className={`${Button} ${state.personTab === TABS.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ personTab: TABS.CREW })} > CREW </div>
            <div className={`${Button} ${state.personTab === TABS.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ personTab: TABS.IMAGES })} > IMAGES </div>
        </div>
        {state.personTab === TABS.BIO && <> {person?.biography && <div className={Bubble}> {person?.biography} </div>} </>}
        {state.personTab === TABS.CAST && <>
            <div className={ButtonRow}>
                <div onClick={() => { setCastFilter('movie') }} className={`${Button} ${castFilter === 'movie' ? 'bg-slate-700' : 'bg-slate-800'}`}> MOVIES </div>
                <div onClick={() => { setCastFilter('tv') }} className={`${Button} ${castFilter === 'tv' ? 'bg-slate-700' : 'bg-slate-800'}`}> SHOWS </div>
            </div>
            <div className={Grid123}>
                {person?.combined_credits?.cast
                    ?.filter(x => x.media_type === castFilter)
                    ?.sort((a, b) => {
                        let aDate = a.release_date || a.first_air_date
                        let bDate = b.release_date || b.first_air_date
                        if (!aDate || !bDate) return 1
                        if (Date.parse(aDate) > Date.parse(bDate)) return -1
                        else return 1
                    })
                    ?.map((x, i) => {
                        let date = (x.release_date || x.first_air_date)
                        return <Link to={`/${x.media_type}/${x.id}`} key={i} className={Card}>
                            {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                            <div className={CardTextBox}>
                                <div> {date ? date.substring(0, 4) : 'TBD'} </div>
                                {(x.name || x.title) && <div> {x.name || x.title} </div>}
                                {x.character && <div className={SubText}> {x.character} </div>}
                                {x.vote_average && x.vote_average > 0 && <Stars average={x.vote_average} />}
                            </div>
                        </Link>
                    })
                }
            </div>
        </>}
        {state.personTab === TABS.CREW && <>
            <div className={SingleRow}>
                <select className={Select} defaultValue={crewFilter} onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                </select>
            </div>
            <div className={Grid123}>
                {person?.combined_credits?.crew
                    ?.filter(x => {
                        if (crewFilter === 'ALL') return true
                        if (x.job === crewFilter) return true
                        else return false
                    })
                    ?.sort((a, b) => {
                        let aDate = a.release_date || a.first_air_date
                        let bDate = b.release_date || b.first_air_date
                        if (!aDate || !bDate) return 1
                        if (Date.parse(aDate) > Date.parse(bDate)) return -1
                        else return 1
                    })
                    ?.map((x, i) => {
                        let date = x.release_date || x.first_air_date
                        return <Link to={`/${x.media_type}/${x.id}`} key={i} className={Card}>
                            {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                            <div className={CardTextBox}>
                                <div> {date ? date.substring(0, 4) : 'TBD'} </div>
                                {(x.name || x.title) && <div> {x.name || x.title} </div>}
                                {x.job && <div className={SubText}> {x.job} </div>}
                                {x.vote_average && x.vote_average > 0 && <Stars average={x.vote_average} />}
                            </div>
                        </Link>
                    })
                }
            </div>
        </>}
        {state.personTab === TABS.IMAGES && <>
            <div className={Grid234}>
                {person?.images?.profiles?.map((x, i) => <img src={IMGURL + x.file_path} alt='' key={i} />)}
            </div>
        </>}
    </>
}
