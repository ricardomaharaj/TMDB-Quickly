import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMovieQuery } from './gql'
import { runtimeCalc, toDateString } from './util'
import { FULLIMGURL, IMGURL, Props } from './consts'
import { Stars } from './Stars'

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

    let [imageTab, setImageTab] = useState('POSTERS')
    let [posterFilter, setPosterFilter] = useState('en')
    let [backdropFilter, setBackdropFilter] = useState('en')
    let [crewFilter, setCrewFilter] = useState('ALL')
    let [videoFilter, setVideoFilter] = useState('ALL')

    let { id } = useParams()
    let [res] = useMovieQuery({ id })
    let { data, fetching, error } = res
    let movie = data?.movie

    document.title = `${movie?.title} | TMDB Quickly`

    let releaseDates = movie?.release_dates?.results?.filter(x => x?.iso_3166_1 === 'US')[0]?.release_dates

    let crewFilterOpts: string[] = []
    let posterLangOpts: string[] = []
    let backdropLangOpts: string[] = []
    let videoFilterOpts: string[] = []

    movie?.credits?.crew?.forEach(({ job }) => { if (crewFilterOpts.findIndex((x) => x === job) === -1) crewFilterOpts.push(job!) })
    movie?.images?.posters?.forEach(({ iso_639_1 }) => { if (posterLangOpts.findIndex((x) => x === iso_639_1) === -1) posterLangOpts.push(iso_639_1!) })
    movie?.images?.backdrops?.forEach(({ iso_639_1 }) => { if (backdropLangOpts.findIndex((x) => x === iso_639_1) === -1) backdropLangOpts.push(iso_639_1!) })
    movie?.videos?.results?.forEach(({ type }) => { if (videoFilterOpts.findIndex((x) => x === type) === -1) videoFilterOpts.push(type!) })

    crewFilterOpts.sort((a, b) => { return a > b ? 1 : -1 })
    crewFilterOpts.splice(0, 0, 'ALL')
    videoFilterOpts.splice(0, 0, 'ALL')

    if (fetching) return <div className='spinner' />
    if (error) return <div className='err'> {error.message} </div>
    return <>
        <div className='img-bg' style={{ backgroundImage: `url(${IMGURL + movie?.backdrop_path})` }} >
            <div className='dark-card'>
                {movie?.poster_path && <img className='card-img' src={IMGURL + movie.poster_path} alt='' />}
                <div className='card-text'>
                    {movie?.release_date && <div> {toDateString(movie.release_date)} </div>}
                    {movie?.title && <div
                        onClick={() => navigator.clipboard.writeText(movie?.title?.replaceAll(' ', '.') + '.' + movie?.release_date?.substring(0, 4))}>
                        {movie?.title}
                    </div>}
                    {movie?.tagline && <div className='text-sm'> {movie.tagline} </div>}
                    {movie?.vote_average
                        ? ((movie.vote_average > 0) && <Stars average={movie.vote_average} />)
                        : null
                    }
                </div>
            </div>
        </div>
        <div className='btn-row'>
            {['INFO', 'CAST', 'CREW', 'IMAGES', 'VIDEOS'].map((x, i) =>
                <div
                    className={`btn ${state.movieTab === x ? 'bg3' : 'bg2'}`}
                    onClick={() => updateState({ movieTab: x })}
                    key={i}> {x} </div>
            )}
        </div>
        {state.movieTab === 'INFO' && <>
            {movie?.overview && <div className='bubble'> {movie.overview} </div>}
            <div className='bubble'>
                {movie?.status && <div> Status: {movie?.status} </div>}
                {movie?.runtime
                    ? ((movie.runtime > 0) && <div> Runtime: {runtimeCalc(movie.runtime)} </div>)
                    : null
                }
                {movie?.budget
                    ? ((movie.budget > 0) && <div> Budget: ${movie.budget.toLocaleString()} </div>)
                    : null
                }
                {movie?.revenue
                    ? ((movie.revenue > 0) && <div> Revenue: ${movie.revenue.toLocaleString()} </div>)
                    : null
                }
                {(movie?.budget && movie.revenue)
                    ? (((movie.budget > 0) && (movie.revenue > 0)) && <div> Earnings: ${(movie.revenue - movie.budget).toLocaleString()} </div>)
                    : null
                }
                {movie?.original_language && <div> Original Language: {movie?.original_language} </div>}
                {movie?.original_title && <div> Original Title: {movie?.original_title} </div>}
                {movie?.imdb_id && <div>
                    <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.imdb.com/title/${movie.imdb_id}`}>IMDB</a>
                    <span onClick={() => navigator.clipboard.writeText(movie?.imdb_id!)}> ID: {movie.imdb_id} </span>
                </div>}
                <div>
                    <a className='underline' target='_blank' rel='noopener noreferrer' href={`https://www.themoviedb.org/movie/${movie?.id}`}>TMDB</a>
                    <span> ID: {id} </span>
                </div>
            </div>
            <div className='btn-row'>
                {movie?.genres?.map((x, i) => <div className='bubble' key={i}> {x.name} </div>)}
            </div>
            <div className='btn-row'>
                {releaseDates?.map((x, i) =>
                    <div className='bubble text-sm' key={i}>
                        {x.type && <div> {RELEASE_TYPES[x.type]} </div>}
                        {x.release_date && <div> {toDateString(x.release_date)} </div>}
                    </div>)
                }
            </div>
            <div className='btn-row'>
                {movie?.production_companies?.map((x, i) => <div className='bubble' key={i}> {x.name} </div>)}
            </div>
        </>}
        {state.movieTab === 'CAST' &&
            <div className='grid123'>
                {movie?.credits?.cast?.map((x, i) =>
                    <Link to={`/person/${x.id}`} key={i} className='card'>
                        {x.profile_path && <img className='card-img' src={IMGURL + x.profile_path} alt='' />}
                        <div className='card-text'>
                            {x.name && <div> {x.name} </div>}
                            {x.character && <div className='subtext'> {x.character} </div>}
                        </div>
                    </Link>
                )}
            </div>
        }
        {state.movieTab === 'CREW' && <>
            <div className='single-row'>
                <select defaultValue={crewFilter} onChange={e => setCrewFilter(e.target.value)}>
                    {crewFilterOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                </select>
            </div>
            <div className='grid123'>
                {movie?.credits?.crew
                    ?.filter(({ job }) => {
                        if (crewFilter === 'ALL') return true
                        if (job === crewFilter) return true
                        else return false
                    })
                    ?.map((x, i) =>
                        <Link to={`/person/${x.id}`} key={i} className='card'>
                            {x.profile_path && <img className='card-img' src={IMGURL + x.profile_path} alt='' />}
                            <div className='card-text'>
                                {x.name && <div> {x.name} </div>}
                                {x.job && <div className='subtext'> {x.job} </div>}
                            </div>
                        </Link>
                    )
                }
            </div>
        </>}
        {state.movieTab === 'IMAGES' && <>
            <div className='btn-row'>
                {['POSTERS', 'BACKDROPS'].map((x, i) =>
                    <div
                        className={`btn ${imageTab === x ? 'bg3' : 'bg2'}`}
                        onClick={() => setImageTab(x)}
                        key={i}> {x} </div>
                )}
                {imageTab === 'POSTERS' &&
                    <select defaultValue={posterFilter} onChange={e => setPosterFilter(e.target.value)}>
                        {posterLangOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                    </select>
                }
                {imageTab === 'BACKDROPS' &&
                    <select defaultValue={backdropFilter} onChange={e => setBackdropFilter(e.target.value)}>
                        {backdropLangOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                    </select>
                }
            </div>
            {imageTab === 'POSTERS' &&
                <div className='grid234'>
                    {movie?.images?.posters
                        ?.filter(x => x.iso_639_1 === posterFilter)
                        ?.map((x, i) =>
                            <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                                <img src={IMGURL + x.file_path} alt='' />
                            </a>
                        )
                    }
                </div>
            }
            {imageTab === 'BACKDROPS' && <div className='grid123'>
                {movie?.images?.backdrops
                    ?.filter(x => x.iso_639_1 === backdropFilter)
                    ?.map((x, i) =>
                        <a target='_blank' rel='noopener noreferrer' href={FULLIMGURL + x.file_path} key={i}>
                            <img src={IMGURL + x.file_path} alt='' />
                        </a>
                    )
                }
            </div>}
        </>}
        {state.movieTab === 'VIDEOS' && <>
            <div className='single-row'>
                <select defaultValue={videoFilter} onChange={e => setVideoFilter(e.target.value)}>
                    {videoFilterOpts.map((x, i) => <option value={x} key={i}> {x} </option>)}
                </select>
            </div>
            <div className='grid234'>
                {movie?.videos?.results
                    ?.filter(({ type }) => {
                        if (videoFilter === 'ALL') return true
                        if (type === videoFilter) return true
                        else return false
                    })
                    ?.sort((a, b) => Date.parse(a.published_at!) > Date.parse(b.published_at!) ? -1 : 1)
                    ?.map((x, i) =>
                        <div className='video-card' key={i}>
                            <a target='_blank' rel='noopener noreferrer' href={`https://www.youtube.com/watch?v=${x.key}`}>
                                <img className='video-card-img' src={`https://i.ytimg.com/vi/${x.key}/hqdefault.jpg`} alt='' />
                                <div className='video-card-text'>
                                    <span> {x.name} </span>
                                    {x.published_at && <span className='subtext'> {toDateString(x.published_at)} </span>}
                                </div>
                            </a>
                        </div>
                    )
                }
            </div>
        </>}
    </>
}
