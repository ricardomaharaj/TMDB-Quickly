import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { IMGURL, GENDER, uniqueOnly } from './consts'
import { usePersonQuery } from './gql'
import { Spinner } from './Spinner'

export function Person() {

    enum MEDIA {
        MOVIE = 'MOVIES',
        TV = 'TV SHOWS'
    }

    enum TAB {
        BIO = 'BIO',
        CAST = 'CAST',
        CREW = 'CREW',
        IMAGES = 'IMAGES'
    }

    let [params, setParams] = useSearchParams()

    let tab = params.get('tab') || TAB.BIO
    let media = params.get('media') || MEDIA.MOVIE

    let [movieCrewFilter, setMovieCrewFilter] = useState('ALL')
    let [tvCrewFilter, setTVCrewFilter] = useState('ALL')

    let { id } = useParams()
    let [res, re] = usePersonQuery({ id })
    let { data, fetching, error } = res

    let person = data?.person

    let movieJobs: string[] = []
    let tvJobs: string[] = []

    person?.movie_credits?.crew?.forEach(({ job }) => { movieJobs.push(job!) })
    person?.tv_credits?.crew?.forEach(({ job }) => { tvJobs.push(job!) })

    movieJobs.sort((a, b) => { return a > b ? 1 : -1 })
    tvJobs.sort((a, b) => { return a > b ? 1 : -1 })

    movieJobs = movieJobs.filter(uniqueOnly)
    movieJobs.splice(0, 0, 'ALL')

    tvJobs = tvJobs.filter(uniqueOnly)
    tvJobs.splice(0, 0, 'ALL')

    let calculateAge = (birthday?: string, deathday?: string) => {
        let age: number = 0
        let start: Date = new Date(birthday!)
        let end: Date = new Date()
        if (deathday) end = new Date(deathday)
        age = end.getFullYear() - start.getFullYear()
        return <> Age: {age} </>
    }

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (person) return <>
        <div className='row'>
            <div className='col'>
                <img src={IMGURL + person.profile_path} alt='' />
            </div>
            <div className='col'>
                <div> {person.name} </div>
                <div> Birthday: {new Date(person.birthday!).toDateString().substring(4)} </div>
                {person.deathday && <> Deathday: {new Date(person.deathday).toDateString().substring(4)} </>}
                <div> {calculateAge(person.birthday, person.deathday)} </div>
                <div> Place of Birth: {person.place_of_birth} </div>
                <div> Gender: {GENDER[person.gender!]} </div>
            </div>
        </div>
        <div className='row'>
            <div className={`${tab == TAB.BIO && 'selected'}`} onClick={e => setParams({ tab: TAB.BIO })} > BIO </div>
            <div>|</div>
            <div className={`${tab == TAB.CAST && 'selected'}`} onClick={e => setParams({ tab: TAB.CAST })} > CAST </div>
            <div>|</div>
            <div className={`${tab == TAB.CREW && 'selected'}`} onClick={e => setParams({ tab: TAB.CREW })} > CREW </div>
            <div>|</div>
            <div className={`${tab == TAB.IMAGES && 'selected'}`} onClick={e => setParams({ tab: TAB.IMAGES })} > IMAGES </div>
        </div>
        <hr />
        {(tab == TAB.CAST || tab == TAB.CREW) && <>
            <div className='row'>
                <div className={`${media == MEDIA.MOVIE && 'selected'}`} onClick={e => setParams({ tab, media: MEDIA.MOVIE })}> MOVIES </div>
                <div>|</div>
                <div className={`${media == MEDIA.TV && 'selected'}`} onClick={e => setParams({ tab, media: MEDIA.TV })}> TV SHOWS </div>
                {tab == TAB.CREW && <>
                    <div>|</div>
                    {media == MEDIA.MOVIE && <>
                        <div className={`${movieCrewFilter != 'ALL' && 'selected'}`}>FILTER: </div>
                        <select onChange={e => setMovieCrewFilter(e.target.value)}>
                            {movieJobs.map((x, i) => { return <option value={x} key={i}>{x}</option> })}
                        </select>
                    </>}
                    {media == MEDIA.TV && <>
                        <div className={`${tvCrewFilter != 'ALL' && 'selected'}`}>FILTER: </div>
                        <select onChange={e => setTVCrewFilter(e.target.value)}>
                            {tvJobs.map((x, i) => { return <option value={x} key={i}>{x}</option> })}
                        </select>
                    </>}
                </>}
            </div>
            <hr />
        </>}
        {tab == TAB.BIO && <div> {person.biography?.split('. ').map((x, i) => { return <div className='row' key={i}> {x} </div> })}</div>}
        {tab == TAB.CAST && <>
            {media == MEDIA.MOVIE && <>
                {person.movie_credits?.cast
                    ?.sort((a, b) => parseInt(a.release_date?.substring(0, 4)!) < parseInt(b.release_date?.substring(0, 4)!) ? 1 : -1)
                    ?.map((x, i) => {
                        return <div className='row' key={i}>
                            {x.poster_path ? <>
                                <Link to={`/movie/${x.id}`} className='col' >
                                    <img src={IMGURL + x.poster_path} alt='' />
                                </Link>
                                <div className='col'>
                                    <div> {x.title} | {x.release_date ? <> {x.release_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.character} </div>
                                </div>
                            </> : <>
                                <Link to={`/movie/${x.id}`} className='col' >
                                    <div> {x.title} | {x.release_date ? <> {x.release_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.character} </div>
                                </Link>
                            </>}
                        </div>
                    })}
            </>}
            {media == MEDIA.TV && <>
                {person.tv_credits?.cast
                    ?.sort((a, b) => parseInt(a.first_air_date?.substring(0, 4)!) < parseInt(b.first_air_date?.substring(0, 4)!) ? 1 : -1)
                    ?.map((x, i) => {
                        return <div className='row' key={i}>
                            {x.poster_path ? <>
                                <Link to={`/tv/${x.id}`} className='col'>
                                    <img src={IMGURL + x.poster_path} alt='' />
                                </Link>
                                <div className='col'>
                                    <div> {x.name} | {x.first_air_date ? <>{x.first_air_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.episode_count} Episodes </div>
                                    <div> {x.character} </div>
                                </div>
                            </> : <>
                                <Link to={`/tv/${x.id}`} className='col'>
                                    <div> {x.name} | {x.first_air_date ? <>{x.first_air_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.episode_count} Episodes </div>
                                    <div> {x.character} </div>
                                </Link>
                            </>}
                        </div>
                    })}
            </>}
        </>}
        {tab == TAB.CREW && <>
            {media == MEDIA.MOVIE && <>
                {person.movie_credits?.crew
                    ?.filter(({ job }) => {
                        if (movieCrewFilter == 'ALL') return true
                        if (job == movieCrewFilter) return true
                    })
                    ?.sort((a, b) => parseInt(a.release_date?.substring(0, 4)!) < parseInt(b.release_date?.substring(0, 4)!) ? 1 : -1)
                    ?.map((x, i) => {
                        return <div className='row' key={i}>
                            {x.poster_path ? <>
                                <Link to={`/movie/${x.id}`} className='col' >
                                    <img src={IMGURL + x.poster_path} alt='' />
                                </Link>
                                <div className='col'>
                                    <div> {x.title} | {x.release_date ? <> {x.release_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.job} </div>
                                </div>
                            </> : <>
                                <Link to={`/movie/${x.id}`} className='col' >
                                    <div> {x.title} | {x.release_date ? <> {x.release_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.job} </div>
                                </Link>
                            </>}
                        </div>
                    })}
            </>}
            {media == MEDIA.TV && <>
                {person.tv_credits?.crew
                    ?.filter(({ job }) => {
                        if (tvCrewFilter == 'ALL') return true
                        if (job == tvCrewFilter) return true
                    })
                    ?.sort((a, b) => parseInt(a.first_air_date?.substring(0, 4)!) < parseInt(b.first_air_date?.substring(0, 4)!) ? 1 : -1)
                    ?.map((x, i) => {
                        return <div className='row' key={i}>
                            {x.poster_path ? <>
                                <Link to={`/tv/${x.id}`} className='col'>
                                    <img src={IMGURL + x.poster_path} alt='' />
                                </Link>
                                <div className='col'>
                                    <div> {x.name} | {x.first_air_date ? <>{x.first_air_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.episode_count} Episodes </div>
                                    <div> {x.job} </div>
                                </div>
                            </> : <>
                                <Link to={`/tv/${x.id}`} className='col'>
                                    <div> {x.name} | {x.first_air_date ? <>{x.first_air_date.substring(0, 4)} </> : <> TBD </>} </div>
                                    <div> {x.episode_count} Episodes </div>
                                    <div> {x.job} </div>
                                </Link>
                            </>}
                        </div>
                    })}
            </>}
        </>}
        {tab == TAB.IMAGES && <>
            <div className='row scroll'>
                {person.images?.profiles
                    ?.map((x, i) => {
                        return <img className='poster' src={IMGURL + x.file_path} alt='' key={i} />
                    })}
            </div>
        </>}
    </>
    return <></>
}
