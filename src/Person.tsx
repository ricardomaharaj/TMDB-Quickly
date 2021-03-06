import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePersonQuery } from './gql'
import { toDateString } from './util'
import { IMGURL, Props } from './consts'
import { Stars } from './Stars'

export function Person({ state, updateState }: Props) {

    let [castFilter, setCastFilter] = useState('movie')
    let [crewFilter, setCrewFilter] = useState('ALL')

    let { id } = useParams()
    let [res,] = usePersonQuery({ id })
    let { data, fetching, error } = res
    let person = data?.person

    document.title = `${person?.name} | TMDB Quickly`

    let crewFilterOpts: string[] = []
    person?.combined_credits?.crew?.forEach(({ job }) => { if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!) })
    crewFilterOpts.splice(0, 0, 'ALL')

    let calculateAge = (birthday: string, deathday?: string) => {
        let age: number = 0
        let start: Date = new Date(birthday.replace('-', '/'))
        let end: Date = new Date()
        if (deathday) end = new Date(deathday.replace('-', '/'))
        age = end.getFullYear() - start.getFullYear()
        return age
    }

    let bioSplitter = (bio: string) => {
        bio = bio.replaceAll('\.\ ', '\.\n')
        bio = bio.replaceAll('Dr\.\n', 'Dr\.\ ')
        bio = bio.replaceAll('Mr\.\n', 'Mr\.\ ')
        bio = bio.replaceAll('Ms\.\n', 'Ms\.\ ')
        bio = bio.replaceAll('Mrs\.\n', 'Mrs\.\ ')

        return <>
            {bio.split('\n').map((x, i) =>
                <div key={i}>{x}</div>
            )}
        </>
    }

    if (fetching) return <div className='spinner' />
    if (error) return <div className='err'> {error.message} </div>
    return <>
        <div className='card'>
            {person?.profile_path && <img className='card-img' src={IMGURL + person?.profile_path} alt='' />}
            <div className='card-text'>
                <div> {person?.name} </div>
                {person?.birthday && <div> Born: {toDateString(person.birthday)} </div>}
                {person?.deathday && <div> Died: {toDateString(person.deathday)} </div>}
                {(person?.birthday && !isNaN(calculateAge(person.birthday, person.deathday))) && <div> Age: {calculateAge(person.birthday, person.deathday)} </div>}
            </div>
        </div>
        <div className='btn-row'>
            {['BIO', 'CAST', 'CREW', 'IMAGES'].map((x, i) =>
                <div
                    className={`btn ${state.personTab === x ? 'bg3' : 'bg2'}`}
                    onClick={() => updateState({ personTab: x })}
                    key={i}> {x} </div>
            )}
        </div>
        {state.personTab === 'BIO' && <>
            {person?.biography && <div className='bubble space-y-2'>
                {bioSplitter(person.biography)}
            </div>}
        </>}
        {state.personTab === 'CAST' && <>
            <div className='btn-row'>
                {[
                    { name: 'MOVIES', val: 'movie' },
                    { name: 'SHOWS', val: 'tv' }
                ].map((x, i) =>
                    <div
                        className={`btn ${castFilter === x.val ? 'bg3' : 'bg2'}`}
                        onClick={() => { setCastFilter(x.val) }}
                        key={i}> {x.name} </div>
                )}
            </div>
            <div className='grid123'>
                {person?.combined_credits?.cast
                    ?.filter(x => x.media_type === castFilter)
                    ?.sort((a, b) => {
                        let aDate = a.release_date || a.first_air_date
                        let bDate = b.release_date || b.first_air_date
                        if (!aDate || !bDate) return 1
                        if (Date.parse(aDate) > Date.parse(bDate)) return -1
                        else return 1
                    })
                    ?.map((x, i) =>
                        <Link to={`/${x.media_type}/${x.id}`} key={i} className='card'>
                            {x.poster_path && <img className='card-img' src={IMGURL + x.poster_path} alt='' />}
                            <div className='card-text'>
                                {(x.release_date || x.first_air_date) && <div> {(x.release_date || x.first_air_date)?.substring(0, 4)} </div>}
                                {(x.name || x.title) && <div> {x.name || x.title} </div>}
                                {x.character && <div className='subtext'> {x.character} </div>}
                                {x.vote_average
                                    ? ((x.vote_average > 0) && <Stars average={x.vote_average} />)
                                    : null
                                }
                            </div>
                        </Link>
                    )
                }
            </div>
        </>}
        {state.personTab === 'CREW' && <>
            <div className='single-row'>
                <select defaultValue={crewFilter} onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                </select>
            </div>
            <div className='grid123'>
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
                    ?.map((x, i) =>
                        <Link to={`/${x.media_type}/${x.id}`} key={i} className='card'>
                            {x.poster_path && <img className='card-img' src={IMGURL + x.poster_path} alt='' />}
                            <div className='card-text'>
                                {(x.release_date || x.first_air_date) && <div> {(x.release_date || x.first_air_date)?.substring(0, 4)} </div>}
                                {(x.name || x.title) && <div> {x.name || x.title} </div>}
                                {x.job && <div className='subtext'> {x.job} </div>}
                                {x.vote_average
                                    ? ((x.vote_average > 0) && <Stars average={x.vote_average} />)
                                    : null
                                }
                            </div>
                        </Link>
                    )
                }
            </div>
        </>}
        {state.personTab === 'IMAGES' && <>
            <div className='grid234'>
                {person?.images?.profiles?.map((x, i) => <img src={IMGURL + x.file_path} alt='' key={i} />)}
            </div>
        </>}
    </>
}
