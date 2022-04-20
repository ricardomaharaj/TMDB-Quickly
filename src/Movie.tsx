import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useMovieQuery } from './gql'
import { Spinner } from './Spinner'
import { renderStars } from './util'
import {
    Button,
    ButtonRow,
    IMGURL,
    Grid123,
    RELEASE_TYPES,
    Select,
    Grid234,
    Bubble,
    SubText,
    SingleRow,
    Card,
    CardImg,
    CardTextBox,
    VideoCard,
    VideoCardImg,
    VideoCardTextBox,
    Error
} from './consts'

export function Movie() {

    enum TAB {
        INFO = 'INFO',
        CAST = 'CAST',
        CREW = 'CREW',
        IMAGES = 'IMAGES',
        VIDEOS = 'VIDEOS'
    }

    enum IMAGE_TAB {
        POSTERS,
        BACKDROPS
    }

    let [params, setParams] = useSearchParams()

    let tab = params.get('tab') || TAB.INFO
    let [imageTab, setImageTab] = useState(IMAGE_TAB.POSTERS)

    let [posterFilter, setPosterFilter] = useState('en')
    let [backdropFilter, setBackdropFilter] = useState('en')
    let [crewFilter, setCrewFilter] = useState('ALL')

    let [videoFilter, setVideoFilter] = useState('ALL')

    let { id } = useParams()

    let [res,] = useMovieQuery({ id })
    let { data, fetching, error } = res

    let movie = data?.movie

    let releaseDates = movie?.release_dates?.results?.filter(x => x?.iso_3166_1 === 'US')[0]?.release_dates

    let crewFilterOpts: string[] = []
    let posterLangOpts: string[] = []
    let backdropsLangOpts: string[] = []
    let videoFilterOpts: string[] = []

    movie?.credits?.crew?.forEach(({ job }) => {
        if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!)
    })
    movie?.images?.posters?.forEach(({ iso_639_1 }) => {
        if (posterLangOpts.findIndex(x => x === iso_639_1) === -1) posterLangOpts.push(iso_639_1!)
    })
    movie?.images?.backdrops?.forEach(({ iso_639_1 }) => {
        if (backdropsLangOpts.findIndex(x => x === iso_639_1) === -1) backdropsLangOpts.push(iso_639_1!)
    })
    movie?.videos?.results?.forEach(({ type }) => {
        if (videoFilterOpts.findIndex(x => x === type) === -1) videoFilterOpts.push(type!)
    })

    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    if (movie) return <>
        <div className={Card}>
            {movie.poster_path && <img className={CardImg} src={IMGURL + movie.poster_path} alt='' />}
            <div className={CardTextBox}>
                <div> {new Date(movie.release_date!).getFullYear()} </div>
                <div> {movie.title}  </div>
                <div> {movie.tagline} </div>
                <div> {renderStars(movie.vote_average)} </div>
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${tab === TAB.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.INFO })}> INFO </div>
            <div className={`${Button} ${tab === TAB.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CAST })}> CAST </div>
            <div className={`${Button} ${tab === TAB.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.CREW })}> CREW </div>
            <div className={`${Button} ${tab === TAB.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.IMAGES })}> IMAGES </div>
            <div className={`${Button} ${tab === TAB.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setParams({ tab: TAB.VIDEOS })}> VIDEOS </div>
        </div>
        {tab === TAB.INFO && <>
            <div className={Bubble}>{movie.overview}</div>
            <div className={Bubble}>
                <div> Status: {movie.status} </div>
                <div> Runtime: {movie.runtime} Minutes </div>
                {movie.budget! > 0 && <div> Budget: ${movie.budget?.toLocaleString()} </div>}
                {movie.revenue! > 0 && <div> Revenue: ${movie.revenue?.toLocaleString()} </div>}
                <div> Original Language: {movie.original_language} </div>
                <div> Original Title: {movie.original_title} </div>
                <div> <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.imdb.com/title/${movie.imdb_id}`}>IMDB</a> ID: {movie.imdb_id} </div>
                <div> <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.themoviedb.org/movie/${movie.id}`}>TMDB</a> ID: {movie.id} </div>
                <div> Homepage: <a className='underline' href={movie.homepage}> {movie.homepage} </a> </div>
            </div>
            <div className={ButtonRow}>
                {movie.genres?.map((x, i) => { return <div className={Bubble} key={i}> {x.name} </div> })}
            </div>
            <div className={ButtonRow}>
                {releaseDates?.map((x, i) => {
                    return <div className={Bubble} key={i}>
                        <div className='text-sm'> {RELEASE_TYPES[x.type!]} </div>
                        <div className='text-sm'> {new Date(x.release_date!).toDateString().substring(4)} </div>
                    </div>
                })}
            </div>
            <div className={ButtonRow}>
                {movie.production_companies?.map((x, i) => {
                    return <div className={Bubble} key={i}>
                        <div> {x.name} </div>
                    </div>
                })}
            </div>
        </>}
        {tab === TAB.CAST && <>
            <div className={Grid123}>
                {movie.credits?.cast?.map((x, i) => {
                    return <Link to={`/person/${x.id}`} key={i} className={Card}>
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                        <div className={CardTextBox}>
                            <div> {x.name} </div>
                            <div className={SubText}> {x.character} </div>
                        </div>
                    </Link>
                })}
            </div>
        </>}
        {tab === TAB.CREW && <>
            <div className={SingleRow}>
                <select
                    defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => { return <option value={x} key={i}> {x} </option> })}
                </select>
            </div>
            <div className={Grid123}>
                {movie.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter === 'ALL') return true
                        if (job === crewFilter) return true
                        else return false
                    })
                    .map((x, i) => {
                        return <Link to={`/person/${x.id}`} key={i} className={Card}>
                            {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                            <div className={CardTextBox}>
                                <div> {x.name} </div>
                                <div className={SubText}> {x.job} </div>
                            </div>
                        </Link>
                    })}
            </div>
        </>}
        {tab === TAB.IMAGES && <>
            <div className={ButtonRow}>
                <div className={`${Button} ${imageTab === IMAGE_TAB.POSTERS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setImageTab(IMAGE_TAB.POSTERS)}> POSTERS </div>
                <div className={`${Button} ${imageTab === IMAGE_TAB.BACKDROPS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setImageTab(IMAGE_TAB.BACKDROPS)}> BACKDROPS </div>
                {imageTab === IMAGE_TAB.POSTERS && <>
                    {imageTab === IMAGE_TAB.POSTERS && <>
                        <select defaultValue={posterFilter}
                            className={Select}
                            onChange={e => setPosterFilter(e.target.value)}>
                            {posterLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                        </select>
                    </>}
                </>}
                {imageTab === IMAGE_TAB.BACKDROPS && <>
                    {imageTab === IMAGE_TAB.BACKDROPS && <>
                        <select defaultValue={backdropFilter}
                            className={Select}
                            onChange={e => setBackdropFilter(e.target.value)}>
                            {backdropsLangOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                        </select>
                    </>}
                </>}
            </div>
            {imageTab === IMAGE_TAB.POSTERS && <>
                <div className={Grid234}>
                    {movie.images?.posters
                        ?.filter(x => x.iso_639_1 === posterFilter)
                        ?.map((x, i) => {
                            return <img src={IMGURL + x.file_path} alt='' key={i} />
                        })}
                </div>
            </>}
            {imageTab === IMAGE_TAB.BACKDROPS && <>
                <div className={Grid123}>
                    {movie.images?.backdrops
                        ?.filter(x => x.iso_639_1 === backdropFilter)
                        ?.map((x, i) => {
                            return <div key={i}>
                                <img src={IMGURL + x.file_path} alt='' />
                            </div>
                        })}
                </div>
            </>}
        </>}
        {tab === TAB.VIDEOS && <>
            <div className={SingleRow}>
                <select defaultValue={videoFilter}
                    className={Select}
                    onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => { return <option value={x} key={i}>{x} </option> })}
                </select>
            </div>
            <div className={Grid234}>
                {movie.videos?.results
                    ?.filter(({ type }) => {
                        if (videoFilter === 'ALL') return true
                        if (type === videoFilter) return true
                        else return false
                    })
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) => {
                        return <div className={VideoCard} key={i}>
                            <a target='_blank'
                                rel='noopener noreferrer'
                                href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className={VideoCardImg} src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt='' />
                                <div className={VideoCardTextBox}> {x.name} <span className={SubText}> | {new Date(x.published_at!).toDateString().substring(4)} </span> </div>
                            </a>
                        </div>
                    })}
            </div>
        </>}
    </>
    return <></>
}
