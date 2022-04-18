import { useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { HD_IMGURL, IMGURL, uniqueOnly } from './consts'
import { useShowQuery } from './gql'
import { Spinner } from './Spinner'

export function Show() {

    enum TAB {
        INFO = 'INFO',
        CAST = 'CAST',
        CREW = 'CREW',
        SEASONS = 'SEASONS',
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

    let [crewFilter, setCrewFilter] = useState('ALL')

    let [posterFilter, setPosterFilter] = useState('en')
    let [backdropFilter, setBackdropFilter] = useState('en')

    let [videoFilter, setVideoFilter] = useState('Trailer')

    let { id } = useParams()
    let [res, re] = useShowQuery({ id })
    let { data, fetching, error } = res

    let show = data?.show

    let jobs: string[] = []

    let posterLangOpts: string[] = []
    let backdropsLangOpts: string[] = []

    let videoFilterOpts: string[] = []

    show?.credits?.crew?.forEach(({ job }) => { jobs.push(job!) })

    show?.images?.posters?.forEach(({ iso_639_1 }) => { posterLangOpts.push(iso_639_1!) })
    show?.images?.backdrops?.forEach(({ iso_639_1 }) => { backdropsLangOpts.push(iso_639_1!) })

    show?.videos?.results?.forEach(({ type }) => { videoFilterOpts.push(type!) })

    jobs.sort((a, b) => { return a > b ? 1 : -1 })
    jobs = jobs.filter(uniqueOnly)
    jobs.splice(0, 0, 'ALL')

    posterLangOpts = posterLangOpts.filter(uniqueOnly)
    backdropsLangOpts = backdropsLangOpts.filter(uniqueOnly)

    videoFilterOpts = videoFilterOpts.filter(uniqueOnly)

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (show) return <>
        <div className='row'>
            {show.poster_path && <div className='col'>
                <img src={IMGURL + show.poster_path} alt='' />
            </div>}
            <div className='col'>
                <div> {show.name} | {show.first_air_date?.substring(0, 4)} </div>
                <div> {show.tagline} </div>
                <div> {show.overview} </div>
            </div>
        </div>
        <div className='row'>
            <div className={`${tab == TAB.INFO && 'selected'}`} onClick={e => setParams({ tab: TAB.INFO })}> INFO </div>
            <div>|</div>
            <div className={`${tab == TAB.CAST && 'selected'}`} onClick={e => setParams({ tab: TAB.CAST })}> CAST </div>
            <div>|</div>
            <div className={`${tab == TAB.CREW && 'selected'}`} onClick={e => setParams({ tab: TAB.CREW })}> CREW </div>
            <div>|</div>
            <div className={`${tab == TAB.SEASONS && 'selected'}`} onClick={e => setParams({ tab: TAB.SEASONS })}> SEASONS </div>
            <div>|</div>
            <div className={`${tab == TAB.IMAGES && 'selected'}`} onClick={e => setParams({ tab: TAB.IMAGES })}> IMAGES </div>
            <div>|</div>
            <div className={`${tab == TAB.VIDEOS && 'selected'}`} onClick={e => setParams({ tab: TAB.VIDEOS })}> VIDEOS </div>
        </div>
        <hr />
        {tab == TAB.INFO && <>
            <div> Status: {show.status} </div>
            <div> {show.number_of_seasons} Seasons | {show.number_of_episodes} Episodes </div>
            <div> {show.episode_run_time![0]} Minutes </div>
            <div> Languages: </div>
            <div className='row'>
                {show.languages?.map((x, i) => {
                    return <div key={i}> {x} </div>
                })}
            </div>
            <div> Networks: </div>
            <div className='row'>
                {show.networks?.map((x, i) => {
                    return <div key={i}> {x.name} </div>
                })}
            </div>
            <div> Origin Country: </div>
            <div className='row'>
                {show.origin_country?.map((x, i) => {
                    return <div key={i}> {x} </div>
                })} </div>
            <div> Original Language: {show.original_language} </div>
            <div> Original Name: {show.original_name} </div>
            <div> Production Companies: </div>
            <div className='row'>
                {show.production_companies?.map((x, i) => {
                    return <div key={i}> {x.name} </div>
                })}
            </div>
            <div> Spoken Languages: </div>
            <div className='row'>
                {show.spoken_languages?.map((x, i) => {
                    return <div key={i}> {x.name} </div>
                })}
            </div>
            <div>
                <a style={{ color: 'wheat' }} href={`https://www.imdb.com/title/${show.external_ids?.imdb_id}`}>IMDB: </a>{show.external_ids?.imdb_id}
            </div>
        </>}
        {tab == TAB.CAST && <>
            {show.credits?.cast?.map((x, i) => {
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
            {show.credits?.crew
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
        {tab == TAB.SEASONS && <>
            {show.seasons?.map((x, i) => {
                return <div className='row' key={i}>
                    {x.poster_path ? <>
                        <Link to={`/tv/${id}/season/${x.season_number}`} className='col'>
                            <img src={IMGURL + x.poster_path} alt='' />
                        </Link>
                        <div className='col'>
                            <div> {x.name} | {x.episode_count} Episodes </div>
                            <div> {new Date(x.air_date!).toDateString().substring(4)} </div>
                            <div> {x.overview} </div>
                        </div>
                    </> : <>
                        <Link to={`/tv/${id}/season/${x.season_number}`} className='col'>
                            <div> {x.name} | {x.episode_count} Episodes </div>
                            <div> {new Date(x.air_date!).toDateString().substring(4)} </div>
                            <div> {x.overview} </div>
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
                    {show.images?.posters
                        ?.filter(x => x.iso_639_1 == posterFilter)
                        ?.map((x, i) => {
                            return <img className='poster' src={HD_IMGURL + x.file_path} alt='' key={i} />
                        })}
                </div>
            </>}
            {imageTab == IMAGE.BACKDROP && <>
                {show.images?.backdrops
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
            {show.videos?.results
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
