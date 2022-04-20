import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { usePersonQuery } from './gql'
import { Spinner } from './Spinner'
import { renderStars } from './util'
import {
    IMGURL,
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
} from './consts'

export function Person() {

    enum TAB {
        BIO = 'BIO',
        CAST = 'CAST',
        CREW = 'CREW',
        IMAGES = 'IMAGES'
    }

    enum CAST {
        MOVIES = 'movie',
        SHOWS = 'tv'
    }

    let [params, setParams] = useSearchParams()

    let tab = params.get('tab') || TAB.BIO

    let [castFilter, setCastFilter] = useState(CAST.MOVIES)
    let [crewFilter, setCrewFilter] = useState('ALL')

    let { id } = useParams()
    let { "0": res } = usePersonQuery({ id })
    let { data, fetching, error } = res

    let person = data?.person

    let crewFilterOpts: string[] = []
    person?.combined_credits?.crew?.forEach(({ job }) => {
        if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!)
    })
    crewFilterOpts.splice(0, 0, 'ALL')

    let calculateAge = (birthday?: string, deathday?: string) => {
        let age: number = 0
        let start: Date = new Date(birthday!)
        let end: Date = new Date()
        if (deathday) end = new Date(deathday)
        age = end.getFullYear() - start.getFullYear()
        return <> Age: {age} </>
    }

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    if (person) return <>
        <div className={Card}>
            {person.profile_path && <img className={CardImg} src={IMGURL + person.profile_path} alt='' />}
            <div className={CardTextBox}>
                <div> {person.name} </div>
                <div> Born: {new Date(person.birthday!).toDateString().substring(4)} </div>
                {person.deathday && <> Died: {new Date(person.deathday).toDateString().substring(4)} </>}
                <div> {calculateAge(person.birthday, person.deathday)} </div>
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TAB.BIO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.BIO })} > BIO </div>
            <div className={`${Button} ${tab === TAB.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CAST })} > CAST </div>
            <div className={`${Button} ${tab === TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CREW })} > CREW </div>
            <div className={`${Button} ${tab === TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.IMAGES })} > IMAGES </div>
        </div>
        {tab === TAB.BIO && <>
            <div className={Bubble}>
                {person.biography}
            </div>
        </>}
        {tab === TAB.CAST && <>
            <div className={ButtonRow}>
                <div
                    className={`${Button} ${castFilter === CAST.MOVIES ? 'bg-slate-700' : 'bg-slate-800'}`}
                    onClick={() => { setCastFilter(CAST.MOVIES) }}
                > MOVIES </div>
                <div
                    className={`${Button} ${castFilter === CAST.SHOWS ? 'bg-slate-700' : 'bg-slate-800'}`}
                    onClick={() => { setCastFilter(CAST.SHOWS) }}
                > SHOWS </div>
            </div>
            <div className={Grid123}>
                {person.combined_credits?.cast
                    ?.filter(x => x.media_type === castFilter)
                    .sort((a, b) => {
                        let aDate = a.release_date || a.first_air_date
                        let bDate = b.release_date || b.first_air_date
                        if (!aDate || !bDate) return 1
                        if (Date.parse(aDate) > Date.parse(bDate)) return -1
                        else return 1
                    })
                    .map((x, i) => {
                        let date = x.release_date || x.first_air_date
                        return <Link to={`/${x.media_type}/${x.id}`} key={i} className={Card}>
                            {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                            <div className={CardTextBox}>
                                {date ? <div> {new Date(date).getFullYear()} </div> : <div> TBD </div>}
                                <div> {x.name || x.title} </div>
                                <div className={SubText}> {x.character} </div>
                                {renderStars(x.vote_average)}
                            </div>
                        </Link>
                    })
                }
            </div>
        </>}
        {tab === TAB.CREW && <>
            <div className={SingleRow}>
                <select
                    defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}
                >
                    {crewFilterOpts.map((x, i) => { return <option value={x} key={i}>{x}</option> })}
                </select>
            </div>
            <div className={Grid123}>
                {person.combined_credits?.crew
                    ?.filter(x => {
                        if (crewFilter === 'ALL') return true
                        if (x.job === crewFilter) return true
                        else return false
                    })
                    .sort((a, b) => {
                        let aDate = a.release_date || a.first_air_date
                        let bDate = b.release_date || b.first_air_date
                        if (!aDate || !bDate) return 1
                        if (Date.parse(aDate) > Date.parse(bDate)) return -1
                        else return 1
                    })
                    .map((x, i) => {
                        let date = x.release_date || x.first_air_date
                        return <Link to={`/${x.media_type}/${x.id}`} key={i} className={Card}>
                            {x.poster_path && <img className={CardImg} src={IMGURL + x.poster_path} alt='' />}
                            <div className={CardTextBox}>
                                {date ? <div> {new Date(date).getFullYear()} </div> : <div> TBD </div>}
                                <div> {x.name || x.title} </div>
                                <div className={SubText}> {x.job} </div>
                                {renderStars(x.vote_average)}
                            </div>
                        </Link>
                    })
                }
            </div>
        </>}
        {tab === TAB.IMAGES && <>
            <div className={Grid234}>
                {person.images?.profiles
                    ?.map((x, i) => {
                        return <img src={IMGURL + x.file_path} alt='' key={i} />
                    })}
            </div>
        </>}
    </>
    return <></>
}
