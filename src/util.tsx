import { STAR } from './consts'

export function renderStars(average?: number) {
    return <div className='row space-x-2 my-2'>
        {new Array(parseInt((average! / 2).toString()!)).fill(STAR).map((x, i) => { return <span key={i}> {x} </span> })}
    </div>
}
