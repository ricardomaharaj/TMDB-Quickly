import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HD_IMGURL, IMGURL, IMGURL_WIDE } from './consts'
import { useSeasonQuery } from './gql'
import { Spinner } from './Spinner'

export function Season() {

    let { id, season } = useParams()

    let [res, re] = useSeasonQuery({ id, season })
    let { data, fetching, error } = res

    let [tab, setTab] = useState(1)

    let showSeason = data?.season

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (showSeason) return <>
        <div className='row'>
            <div className='col'>
                <img src={IMGURL + showSeason.poster_path} alt='' />
            </div>
            <div className='col'>
                <div> {showSeason.name} | {showSeason.episodes?.length} Episodes </div>
                <div> {new Date(showSeason.air_date!).toDateString().substring(4)} </div>
                <div> {showSeason.overview} </div>
            </div>
        </div>
        <div className='row'>
            <div className={`${tab == 1 && 'selected'}`} onClick={e => setTab(1)}> EPISODES </div>
            <div>|</div>
            <div className={`${tab == 2 && 'selected'}`} onClick={e => setTab(2)}> CAST </div>
            <div>|</div>
            <div className={`${tab == 3 && 'selected'}`} onClick={e => setTab(3)}> CREW </div>
            <div>|</div>
            <div className={`${tab == 4 && 'selected'}`} onClick={e => setTab(4)}> IMAGES </div>
        </div>
        <hr />
        {tab == 1 && <>
            {showSeason.episodes?.map((x, i) => {
                return <div key={i}>
                    {x.still_path ? <>
                        <div className='row'>
                            <Link to={`/tv/${id}/season/${season}/episode/${x.episode_number}`}>
                                <img src={IMGURL_WIDE + x.still_path} alt='' />
                            </Link>
                        </div>
                        <div className='col'>
                            <div> {x.episode_number} | {x.name} | {new Date(x.air_date!).toDateString().substring(4)} </div>
                            <div> {x.overview} </div>
                        </div>
                    </> : <>
                        <Link to={`/tv/${id}/season/${season}/episode/${x.episode_number}`} className='col' >
                            <div> {x.episode_number} | {x.name} | {new Date(x.air_date!).toDateString().substring(4)} </div>
                            <div> {x.overview} </div>
                        </Link>
                    </>}
                    <hr />
                </div>
            })}
        </>}
        {tab == 2 && <>
            {showSeason.credits?.cast?.map((x, i) => {
                return <div className='row' key={i}>
                    {x.profile_path ? <>
                        <Link to={`/person/${x.id}`} className='col'>
                            <img src={IMGURL + x.profile_path!} alt='' />
                        </Link>
                        <div className='col'>
                            <div> {x.name} </div>
                            <div> {x.character} </div>
                        </div>
                    </> : <>
                        <Link to={`/person/${x.id}`} className='col' >
                            <div> {x.name} </div>
                            <div> {x.character} </div>
                        </Link>
                    </>}
                </div>
            })}
        </>}
        {tab == 3 && <>
            {showSeason.credits?.crew?.map((x, i) => {
                return <div className='row' key={i}>
                    {x.profile_path ? <>
                        <Link to={`/person/${x.id}`} className='col'>
                            <img src={IMGURL + x.profile_path!} alt='' />
                        </Link>
                        <div className='col'>
                            <div> {x.name} </div>
                            <div> {x.job} </div>
                        </div>
                    </> : <>
                        <Link to={`/person/${x.id}`} className='col' >
                            <div> {x.name} </div>
                            <div> {x.job} </div>
                        </Link>
                    </>}
                </div>
            })}
        </>}
        {tab == 4 && <>
            <div className='row scroll'>
                {showSeason.images?.posters
                    ?.filter(x => x.iso_639_1 == 'en')
                    ?.map((x, i) => {
                        return <img className='poster' src={HD_IMGURL + x.file_path} alt='' key={i} />
                    })}
            </div>
        </>}
    </>
    return <></>
}
