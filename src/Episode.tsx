import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HD_IMGURL, IMGURL, IMGURL_WIDE } from './consts'
import { useEpisodeQuery } from './gql'
import { Spinner } from './Spinner'

export function Episode() {

    let { id, season, episode } = useParams()

    let [res, re] = useEpisodeQuery({ id, season, episode })
    let { data, fetching, error } = res

    let [tab, setTab] = useState(1)

    let ep = data?.episode

    if (fetching) return <Spinner />
    if (error) return <> {JSON.stringify(error)} </>
    if (ep) return <>
        <div className='row'>
            <div className='col'>
                <img src={IMGURL_WIDE + ep.still_path} alt='' />
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <div> S{ep.season_number?.toString().padStart(2, '0')}E{ep.episode_number?.toString().padStart(2, '0')} | {ep.name} | {new Date(ep.air_date!).toDateString().substring(4)} </div>
                <div> {ep.overview} </div>
            </div>
        </div>
        <div className='row'>
            <div className={`${tab == 1 && 'selected'}`} onClick={e => setTab(1)}> GUEST STARS </div>
            <div>|</div>
            <div className={`${tab == 2 && 'selected'}`} onClick={e => setTab(2)}> CREW </div>
            <div>|</div>
            <div className={`${tab == 3 && 'selected'}`} onClick={e => setTab(3)}> IMAGES </div>
        </div>
        <hr />
        {tab == 1 && <>
            {ep.guest_stars?.map((x, i) => {
                return <div className='row' key={i}>
                    {x.profile_path ? <>
                        <Link to={`/person/${x.id}`} className='col' >
                            <img src={IMGURL + x.profile_path} alt='' />
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
        {tab == 2 && <>
            {ep.crew?.map((x, i) => {
                return <div className='row' key={i}>
                    {x.profile_path ? <>
                        <Link to={`/person/${x.id}`} className='col' >
                            <img src={IMGURL + x.profile_path} alt='' />
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
        {tab == 3 && <>
            {ep.images?.stills?.map((x, i) => {
                return <div className='row' key={i}>
                    <img className='backdrop' src={HD_IMGURL + x.file_path} alt="" />
                </div>
            })}
        </>}
    </>
    return <></>
}
