import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMovieQuery } from './gql'
import { Spinner } from './Spinner'
import { renderStars, toDateString } from './util'
import { FULLIMGURL, IMGURL, Props, TABS } from './consts'
import {
    Button,
    ButtonRow,
    Grid123,
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
    Error,
    BlurCard,
    ImageBG
} from './ThemeData'

const RELEASE_TYPES = [
    '',
    'Premiere',
    'Theatrical (limited)',
    'Theatrical',
    'Digital',
    'Physical',
    'TV',
]

export function Movie({ state, updateState }: Props) {

    let [imageTab, setImageTab] = useState(TABS.POSTERS)
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
    let backdropLangOpts: string[] = []
    let videoFilterOpts: string[] = []

    movie?.credits?.crew?.forEach(({ job }) => {
        if (crewFilterOpts.findIndex(x => x === job) === -1) crewFilterOpts.push(job!)
    })
    movie?.images?.posters?.forEach(({ iso_639_1 }) => {
        if (posterLangOpts.findIndex(x => x === iso_639_1) === -1) posterLangOpts.push(iso_639_1!)
    })
    movie?.images?.backdrops?.forEach(({ iso_639_1 }) => {
        if (backdropLangOpts.findIndex(x => x === iso_639_1) === -1) backdropLangOpts.push(iso_639_1!)
    })
    movie?.videos?.results?.forEach(({ type }) => {
        if (videoFilterOpts.findIndex(x => x === type) === -1) videoFilterOpts.push(type!)
    })

    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <Spinner />
    if (error) return <div className={Error}> {error.message} </div>
    return <>
        <div className={ImageBG} style={{
            backgroundImage: `url(${FULLIMGURL + movie?.backdrop_path})`
        }}>
            <div className={BlurCard}>
                {movie?.poster_path && <>
                    <img className={CardImg} src={IMGURL + movie?.poster_path} alt='' />
                </>}
                <div className={CardTextBox}>
                    {movie?.release_date && <div> {movie.release_date.substring(0, 4)} </div>}
                    <div> {movie?.title}  </div>
                    <div className='text-sm'> {movie?.tagline} </div>
                    <div> {renderStars(movie?.vote_average!)} </div>
                </div>
            </div>
        </div>
        <div className={ButtonRow}>
            <div className={`${Button} ${state.movieTab === TABS.INFO ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ movieTab: TABS.INFO })}> INFO </div>
            <div className={`${Button} ${state.movieTab === TABS.CAST ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ movieTab: TABS.CAST })}> CAST </div>
            <div className={`${Button} ${state.movieTab === TABS.CREW ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ movieTab: TABS.CREW })}> CREW </div>
            <div className={`${Button} ${state.movieTab === TABS.IMAGES ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ movieTab: TABS.IMAGES })}> IMAGES </div>
            <div className={`${Button} ${state.movieTab === TABS.VIDEOS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={() => updateState({ movieTab: TABS.VIDEOS })}> VIDEOS </div>
        </div>
        {state.movieTab === TABS.INFO && <>
            <div className={Bubble}> {movie?.overview} </div>
            <div className={Bubble}>
                <div> Status: {movie?.status} </div>
                <div> Runtime: {movie?.runtime} Minutes </div>
                {movie?.budget! > 0 && <div> Budget: ${movie?.budget?.toLocaleString()} </div>}
                {movie?.revenue! > 0 && <div> Revenue: ${movie?.revenue?.toLocaleString()} </div>}
                <div> Original Language: {movie?.original_language} </div>
                <div> Original Title: {movie?.original_title} </div>
                <div> <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.imdb.com/title/${movie?.imdb_id}`}>IMDB</a> ID: {movie?.imdb_id} </div>
                <div> <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.themoviedb.org/movie/${movie?.id}`}>TMDB</a> ID: {movie?.id} </div>
                <div> Homepage: <a className='underline' href={movie?.homepage}> {movie?.homepage} </a> </div>
            </div>
            <div className={ButtonRow}>
                {movie?.genres?.map((x, i) => <div className={Bubble} key={i}> {x.name} </div>)}
            </div>
            <div className={ButtonRow}>
                {releaseDates?.map((x, i) =>
                    <div className={Bubble} key={i}>
                        <div className='text-sm'> {RELEASE_TYPES[x.type!]} </div>
                        <div className='text-sm'> {toDateString(x.release_date!)} </div>
                    </div>
                )}
            </div>
            <div className={ButtonRow}>
                {movie?.production_companies?.map((x, i) =>
                    <div className={Bubble} key={i}>
                        <div> {x.name} </div>
                    </div>
                )}
            </div>
        </>}
        {state.movieTab === TABS.CAST && <>
            <div className={Grid123}>
                {movie?.credits?.cast?.map((x, i) =>
                    <Link to={`/person/${x.id}`} key={i} className={Card}>
                        {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                        <div className={CardTextBox}>
                            <div> {x.name} </div>
                            <div className={SubText}> {x.character} </div>
                        </div>
                    </Link>
                )}
            </div>
        </>}
        {state.movieTab === TABS.CREW && <>
            <div className={SingleRow}>
                <select
                    defaultValue={crewFilter}
                    className={Select}
                    onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                </select>
            </div>
            <div className={Grid123}>
                {movie?.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter === 'ALL') return true
                        if (job === crewFilter) return true
                        else return false
                    })
                    .map((x, i) =>
                        <Link to={`/person/${x.id}`} key={i} className={Card}>
                            {x.profile_path && <img className={CardImg} src={IMGURL + x.profile_path} alt='' />}
                            <div className={CardTextBox}>
                                <div> {x.name} </div>
                                <div className={SubText}> {x.job} </div>
                            </div>
                        </Link>
                    )}
            </div>
        </>}
        {state.movieTab === TABS.IMAGES && <>
            <div className={ButtonRow}>
                <div className={`${Button} ${imageTab === TABS.POSTERS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setImageTab(TABS.POSTERS)}> POSTERS </div>
                <div className={`${Button} ${imageTab === TABS.BACKDROPS ? 'bg-slate-700' : 'bg-slate-800'}`} onClick={e => setImageTab(TABS.BACKDROPS)}> BACKDROPS </div>
                {imageTab === TABS.POSTERS && <>
                    {imageTab === TABS.POSTERS && <>
                        <select defaultValue={posterFilter}
                            className={Select}
                            onChange={e => setPosterFilter(e.target.value)}>
                            {posterLangOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                        </select>
                    </>}
                </>}
                {imageTab === TABS.BACKDROPS && <>
                    {imageTab === TABS.BACKDROPS && <>
                        <select defaultValue={backdropFilter}
                            className={Select}
                            onChange={e => setBackdropFilter(e.target.value)}>
                            {backdropLangOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                        </select>
                    </>}
                </>}
            </div>
            {imageTab === TABS.POSTERS && <>
                <div className={Grid234}>
                    {movie?.images?.posters
                        ?.filter(x => x.iso_639_1 === posterFilter)
                        ?.map((x, i) =>
                            <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                                <img src={IMGURL + x.file_path} alt='' />
                            </a>
                        )}
                </div>
            </>}
            {imageTab === TABS.BACKDROPS && <>
                <div className={Grid123}>
                    {movie?.images?.backdrops
                        ?.filter(x => x.iso_639_1 === backdropFilter)
                        ?.map((x, i) =>
                            <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                                <img src={IMGURL + x.file_path} alt='' />
                            </a>
                        )}
                </div>
            </>}
        </>}
        {state.movieTab === TABS.VIDEOS && <>
            <div className={SingleRow}>
                <select defaultValue={videoFilter}
                    className={Select}
                    onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => <option value={x} key={i}>{x} </option>)}
                </select>
            </div>
            <div className={Grid234}>
                {movie?.videos?.results
                    ?.filter(({ type }) => {
                        if (videoFilter === 'ALL') return true
                        if (type === videoFilter) return true
                        else return false
                    })
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) =>
                        <div className={VideoCard} key={i}>
                            <a target='_blank' rel='noopener noreferrer'
                                href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className={VideoCardImg} src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt='' />
                                <div className={VideoCardTextBox}> {x.name} <span className={SubText}> | {toDateString(x.published_at!)} </span> </div>
                            </a>
                        </div>
                    )}
            </div>
        </>}
    </>
}
