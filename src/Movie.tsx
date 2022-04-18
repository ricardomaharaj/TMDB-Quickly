import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { HD_IMGURL, IMGURL, RELEASE_TYPES, uniqueOnly } from './consts'
import { useMovieQuery } from './gql'
import { Spinner } from './Spinner'

export function Movie() {

    enum TAB {
        INFO = 'INFO',
        CAST = 'CAST',
        CREW = 'CREW',
        IMAGES = 'IMAGES',
        VIDEOS = 'VIDEOS'
    }

    enum IMAGE {
        POSTER,
        BACKDROP
    }

    let [params, setParams] = useSearchParams()

    let tab = params.get('tab') || TAB.INFO
    let [imageTab, setImageTab] = useState(IMAGE.POSTER)

    let [posterFilter, setPosterFilter] = useState('en')
    let [backdropFilter, setBackdropFilter] = useState('en')
    let [crewFilter, setCrewFilter] = useState('ALL')

    let [videoFilter, setVideoFilter] = useState('Trailer')

    let { id } = useParams()

    let [res, re] = useMovieQuery({ id })
    let { data, fetching, error } = res

    let movie = data?.movie

    let releaseDates = movie?.release_dates?.results?.filter(x => x?.iso_3166_1 == 'US')[0]?.release_dates

    let jobs: string[] = []

    let posterLangOpts: string[] = []
    let backdropsLangOpts: string[] = []

    let videoFilterOpts: string[] = []

    movie?.credits?.crew?.forEach(({ job }) => { jobs.push(job!) })

    movie?.images?.posters?.forEach(({ iso_639_1 }) => { posterLangOpts.push(iso_639_1!) })
    movie?.images?.backdrops?.forEach(({ iso_639_1 }) => { backdropsLangOpts.push(iso_639_1!) })

    movie?.videos?.results?.forEach(({ type }) => { videoFilterOpts.push(type!) })

    jobs.sort((a, b) => { return a > b ? 1 : -1 })
    jobs = jobs.filter(uniqueOnly)
    jobs.splice(0, 0, 'ALL')

    posterLangOpts = posterLangOpts.filter(uniqueOnly)
    backdropsLangOpts = backdropsLangOpts.filter(uniqueOnly)

    videoFilterOpts = videoFilterOpts.filter(uniqueOnly)

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (movie) return <>
        <div className='row'>
            {movie.poster_path && <div className='col'>
                <img src={IMGURL + movie.poster_path} alt='' />
            </div>}
            <div className='col'>
                <div> {movie.title} | {movie.release_date?.substring(0, 4)} </div>
                <div> {movie.tagline} </div>
                <div> {movie.overview} </div>
            </div>
        </div>
        <div className='row'>
            <div className={`${tab == TAB.INFO && 'selected'}`} onClick={e => setParams({ tab: TAB.INFO })}> INFO </div>
            <div>|</div>
            <div className={`${tab == TAB.CAST && 'selected'}`} onClick={e => setParams({ tab: TAB.CAST })}> CAST </div>
            <div>|</div>
            <div className={`${tab == TAB.CREW && 'selected'}`} onClick={e => setParams({ tab: TAB.CREW })}> CREW </div>
            <div>|</div>
            <div className={`${tab == TAB.IMAGES && 'selected'}`} onClick={e => setParams({ tab: TAB.IMAGES })}> IMAGES </div>
            <div>|</div>
            <div className={`${tab == TAB.VIDEOS && 'selected'}`} onClick={e => setParams({ tab: TAB.VIDEOS })}> VIDEOS </div>
        </div>
        <hr />
        {tab == TAB.INFO && <>
            {movie.runtime! > 0 && <div> Runtime:  {movie.runtime} Minutes / {(movie.runtime! / 60).toString().substring(0, 4)} Hours </div>}
            {movie.budget! > 0 && <div> Budget: ${movie.budget?.toLocaleString()} </div>}
            {movie.revenue! > 0 && <div> Revenue: ${movie.revenue?.toLocaleString()} </div>}
            {(movie.revenue! - movie.budget!) > 0 && <div> Earnings: ${(movie.revenue! - movie.budget!).toLocaleString()} </div>}
            <div> Production Companies: </div>
            <div className='row'>
                {movie.production_companies?.map((x, i) => {
                    return <div key={i}> {x.name} </div>
                })}
            </div>
            <div> Original Language: {movie.original_language} </div>
            <div> Original Title: {movie.original_title} </div>
            <div> Spoken Languages: </div>
            <div className='row'>
                {movie.spoken_languages?.map((x, i) => {
                    return <div key={i}> {x.name} </div>
                })}
            </div>
            {releaseDates && <>
                <div> Release Dates: </div>
                <div className='row'>
                    {releaseDates?.map((x, i) => {
                        return <div key={i}>
                            <div> {RELEASE_TYPES[x.type!]} </div>
                            <div> {new Date(x.release_date!).toDateString().substring(4)} </div>
                        </div>
                    })}
                </div>
            </>}
            <div>
                <a style={{ color: 'wheat' }} href={`https://www.imdb.com/title/${movie.imdb_id}`} target='_blank'>IMDB: </a>{movie.imdb_id}
            </div>
        </>}
        {tab == TAB.CAST && <>
            {movie.credits?.cast?.map((x, i) => {
                return <div className='row' key={i}>
                    {x.profile_path ? <>
                        <Link to={`/person/${x.id}`} className='col' >
                            <img src={IMGURL + x.profile_path!} alt='' />
                        </Link>
                        <div className='col'>
                            <div> {x.name} </div>
                            <div> {x.character} </div>
                        </div>
                    </> : <>
                        <Link to={`/person/${x.id}`} className='col'>
                            <div> {x.name} </div>
                            <div> {x.character} </div>
                        </Link>
                    </>}
                </div>
            })}
        </>}
        {tab == TAB.CREW && <>
            <div className='row'>
                <div className={`${crewFilter != 'ALL' && 'selected'}`} > FILTER: </div>
                <select onChange={e => setCrewFilter(e.target.value)}>
                    {jobs.map((x, i) => {
                        return <option value={x} key={i}>{x}</option>
                    })}
                </select>
            </div>
            <hr />
            {movie.credits?.crew
                ?.filter(({ job }) => {
                    if (crewFilter == 'ALL') return true
                    if (job == crewFilter) return true
                })
                .map((x, i) => {
                    return <div className='row' key={i}>
                        {x.profile_path ? <>
                            <Link to={`/person/${x.id}`} className='col' >
                                <img src={IMGURL + x.profile_path!} alt='' />
                            </Link>
                            <div className='col'>
                                <div> {x.name} </div>
                                <div> {x.job} </div>
                            </div>
                        </> : <>
                            <Link to={`/person/${x.id}`} className='col'>
                                <div> {x.name} </div>
                                <div> {x.job} </div>
                            </Link>
                        </>}
                    </div>
                })}
        </>}
        {tab == TAB.IMAGES && <>
            <div className='row'>
                <div className={`${imageTab == IMAGE.POSTER && 'selected'}`} onClick={e => setImageTab(IMAGE.POSTER)}> POSTERS </div>
                <div>|</div>
                <div className={`${imageTab == IMAGE.BACKDROP && 'selected'}`} onClick={e => setImageTab(IMAGE.BACKDROP)}> BACKDROPS </div>
                <div>|</div>
                <div> Language: </div>
                {imageTab == IMAGE.POSTER && <>
                    <select onChange={e => setPosterFilter(e.target.value)}>
                        {posterLangOpts.map((x, i) => {
                            return <option value={x} key={i}>{x}</option>
                        })}
                    </select>
                </>}
                {imageTab == IMAGE.BACKDROP && <>
                    <select onChange={e => setBackdropFilter(e.target.value)}>
                        {backdropsLangOpts.map((x, i) => {
                            return <option value={x} key={i}>{x}</option>
                        })}
                    </select>
                </>}
            </div>
            <hr />
            {imageTab == IMAGE.POSTER && <>
                <div className='row scroll'>
                    {movie.images?.posters
                        ?.filter(x => x.iso_639_1 == posterFilter)
                        ?.map((x, i) => {
                            return <img className='poster' src={HD_IMGURL + x.file_path} alt='' key={i} />
                        })}
                </div>
            </>}
            {imageTab == IMAGE.BACKDROP && <>
                {movie.images?.backdrops
                    ?.filter(x => x.iso_639_1 == backdropFilter)
                    ?.map((x, i) => {
                        return <div className='row' key={i} >
                            <img className='backdrop' src={HD_IMGURL + x.file_path} alt='' />
                        </div>
                    })}
            </>}
        </>}
        {tab == TAB.VIDEOS && <>
            <div className='row'>
                <div> Type: </div>
                <select defaultValue={'Trailer'} onChange={e => setVideoFilter(e.target.value)}> {videoFilterOpts.map((x, i) => { return <option value={x} key={i}>{x}</option> })} </select>
            </div>
            <hr />
            {movie.videos?.results
                ?.filter(x => x.type == videoFilter)
                ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                ?.map((x, i) => {
                    return <div className='row' key={i} >
                        <a href={`https://www.youtube.com/watch?v=${x.key}`} target='_blank'> {x.name} | {new Date(x.published_at!).toDateString().substring(4)} </a>
                    </div>
                })}
        </>}
    </>
    return <></>
}
